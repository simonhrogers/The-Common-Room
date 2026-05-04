/*
Document ids which:
- cannot be created in the 'new document' menu
- cannot be duplicated, unpublished or deleted
*/
const LOCKED_DOCUMENT_IDS = [
  'home',
  'about',
  'contact',
  'imprint',
  'privacyPolicy',
  'settings',
  'video.asset',
  'media.tag', // Sanity Media Plugin Tags
]

/*
Return all templates except the locked documents
*/
export const initialValueTemplates = (prev) => {

  const projectSectorProject = {
    id: 'projectSector-project',
    title: 'Project Sector: Project',
    schemaType: 'project',
    parameters: [{name: `parentId`, title: `Parent ID`, type: `string`}],
    // This value will be passed-in from desk structure
    value: ({parentId}) => ({
      sectors: [{_type: 'reference', _ref: parentId}],
    }),
  }

  return [
    ...prev.filter((el) => {
      return !LOCKED_DOCUMENT_IDS.includes(el.schemaType)
    }),
    projectSectorProject
  ]
}

