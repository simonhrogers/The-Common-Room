import { previewSchemaTypes, addPreviewPane } from "./views";

export const pageStructure = (orderedDocumentStructure) => {
  return (S, context) => {
    const client = context.getClient({ apiVersion: '2021-03-25' });

    // Async-safe initial value template helper
    const safeInitialValueTemplate = async (S, client, templateId, parentId) => {
      if (!parentId) return [];
      const exists = await client.fetch('*[_id == $id][0]._id', { id: parentId });

      if (!exists) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Sanity] Skipping template "${templateId}" — parentId "${parentId}" not found.`);
        }
        return [];
      }

      return [S.initialValueTemplateItem(templateId, { parentId })];
    };

    const createDocumentNode = (documentId, schemaType, S) => {
      return S.document()
        .documentId(documentId)
        .schemaType(schemaType)
        .views([
          S.view.form(),
          previewSchemaTypes.includes(schemaType) ? addPreviewPane(S) : null
        ].filter(Boolean));
    };

    const buildItemsFromStructure = (structure) => {
      return structure.map((item) => {
        if (typeof item === 'string') {
          return S.documentTypeListItem(item).title(item);
        }

        if ('type' in item && item.type === 'filterByBoolean') {
          const filterQuery = `_type == $type && ${item.filterValue ? '' : '!'}${item.filterBy}`;
          return S.listItem()
            .title(item.title)
            .icon(item.icon ?? item.display.icon)
            .child(
              S.documentTypeList(item.display.name)
                .title(item.title)
                .filter(filterQuery)
                .params({ type: item.display.name })
            );
        }

        if ('type' in item && item.type === 'groupedByReferenceToParent') {
          const displayTitle = item.display.titlePlural ?? item.display.title;
          const groupByTitle = item.groupBy.titlePlural ?? item.groupBy.title;
          const title = item.title ?? `${displayTitle} by ${item.groupBy.title}`;

          return S.listItem()
            .title(title)
            .schemaType(item.groupBy.name)
            .child(
              S.documentTypeList(item.groupBy.name)
                .title(groupByTitle)
                .child(async (groupById) => {
                  const templateItems = await safeInitialValueTemplate(
                    S,
                    client,
                    `${item.groupBy.name}-${item.display.name}`,
                    groupById
                  );

                  return S.documentTypeList(item.display.name)
                    .title(displayTitle)
                    .filter('_type == $displayName && references($groupById)')
                    .params({
                      displayName: item.display.name,
                      groupById
                    })
                    .canHandleIntent((intentName, params) =>
                      intentName === 'create' &&
                      params.template === `${item.groupBy.name}-${item.display.name}`
                    )
                    .initialValueTemplates(templateItems)
                    .child((documentId) =>
                      createDocumentNode(documentId, item.display.name, S)
                    );
                })
            );
        }

        if ('type' in item && item.type === 'groupedByReferenceOnParent') {
          const displayTitle = item.display.titlePlural ?? item.display.title;
          const groupByTitle = item.groupBy.titlePlural ?? item.groupBy.title;
          const title = item.title ?? `${displayTitle} by ${item.groupBy.title}`;

          return S.listItem()
            .title(title)
            .schemaType(item.groupBy.name)
            .child(async () => {
              const groupByDocuments = await client.fetch(`*[_type == "${item.groupBy.name}"]{ 
                _id, 
                title,
                _type == "typeface" => {
                  "title": name
                },
                "children": ${item.groupBy.childrenFieldName}[]->{
                  _id,
                  title,
                  _type == "style" => { "title": fullName },
                  _type == "language" => { "title": name }
                }
              }`);

              return S.list()
                .title(title)
                .items(
                  groupByDocuments.map((document) =>
                    S.listItem()
                      .title(`${document.title}`)
                      .icon(item.groupBy.icon)
                      .child(
                        S.list()
                          .title(`${document.title}`)
                          .items(
                            (document.children || []).map((child) =>
                              S.listItem()
                                .title(`${child.title}`)
                                .icon(item.display.icon)
                                .child(
                                  createDocumentNode(child._id, item.display.name, S)
                                )
                            )
                          )
                      )
                  )
                );
            });
        }

        if ('type' in item && item.type === 'parentWithReferencedChildren') {

          const { displayType, displayTypeChildrenFieldName, childType, childTypeTitleFieldName } = item

          return S.listItem()
            .title(displayType.titlePlural)
            .schemaType(displayType)
            .icon(displayType.icon)
            .child(
              S.documentTypeList(displayType.name)
                // .defaultLayout('detail')
                .child(async id =>
                  S.list()
                    .title(displayType.title)
                    .items([
                      // Details
                      S.listItem()
                        .title('Details')
                        .icon(displayType.icon)
                        .child(
                          createDocumentNode(id, displayType, S)
                        ),
                      // Documents of a specific type, referenced by the parent
                      S.listItem()
                        .title(childType.titlePlural)
                        .schemaType(childType)
                        .child(async () => {
                          const childDocuments = await client.fetch(`*[_type == "${displayType.name}" && _id == $id].${displayTypeChildrenFieldName}[]->{
                            _id,
                            "title": ${childTypeTitleFieldName}
                          }`, { id: id }) || []

                          console.log(childDocuments)
                          
                          return S.list()
                            .title(childType.titlePlural)
                            .items(
                              (childDocuments || []).map((child) =>
                                S.listItem()
                                  .title(`${child.title}`)
                                  .id(child._id)
                                  .icon(childType.icon)
                                  .child(
                                    createDocumentNode(child._id, childType.name, S)
                                  )
                              )
                            )
                        })
                    ])
                )
            )

        }

        if ('type' in item && item.type === 'nested') {
          return S.listItem()
            .title(item.title)
            .icon(item.icon)
            .child(
              S.list()
                .title(item.title)
                .items(item.items ? buildItemsFromStructure(item.items) : [])
            );
        }

        if ('type' in item && item.type === 'singleton') {
          return S.listItem()
            .title(item.title)
            .icon(item.icon)
            .child(createDocumentNode(item.name, item.name, S));
        }

        if ('type' in item && item.type === 'divider') {
          return S.divider();
        }

        return S.listItem()
          .id(item.name)
          .title(item.titlePlural ?? item.title)
          .icon(item.icon)
          .child(
            S.documentTypeList(item.name)
              .id(item.name)
              .title(item.title)
          );
      });
    };

    const orderedItems = buildItemsFromStructure(orderedDocumentStructure || []);

    return S.list()
      .title('Content')
      .items([...orderedItems]);
  };
};