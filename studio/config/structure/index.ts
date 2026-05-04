// import home from '@/schemas/singletons/home'
// import settings from '@/schemas/singletons/settings'
// import { pageStructure } from "../pageStructure"

// export const structure = pageStructure([home, settings])

// export const structure = (S) =>
// 	S.list()
// 		.title('Content')
// 		.items([
// 			S.documentListItem().id('home').schemaType('home'),

// 			S.listItem({
// 				title: 'Projects',
// 				id: 'projects',
// 				schemaType: 'project',
// 				child: () =>
// 					S.documentTypeList('project')
// 						.title('Projects')
// 						.defaultOrdering([
// 							{
// 								field: 'title',
// 								direction: 'asc',
// 							},
// 						]),
// 			}),

// 			// S.documentListItem().id('pageProjects').schemaType('pageProjects'),

// 			S.listItem({
// 				title: 'Pages',
// 				id: 'pages',
// 				schemaType: 'page',
// 				child: () =>
// 					S.documentTypeList('page')
// 						.title('Pages')
// 						.defaultOrdering([
// 							{
// 								field: 'title',
// 								direction: 'asc',
// 							},
// 						]),
// 			}),

// 			S.divider(),

// 			// S.documentListItem().id('siteNav').schemaType('siteNav'),

// 			// S.documentListItem().id('siteOptions').schemaType('siteOptions'),
// 		])

// export default structure