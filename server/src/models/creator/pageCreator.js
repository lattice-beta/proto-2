export function buildPageForUpdateFromRequest(request) {
    return {
        heading: request.body.heading,
        title: request.body.title,
        editors: request.body.editors,
        editorIndex: request.body.editorIndex,
        layout: request.body.layout,
        workspace: request.body.workspace,
        tags: request.body.tags
      };
  }