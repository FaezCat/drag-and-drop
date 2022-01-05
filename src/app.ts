class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
  
    // note that .content is available on template elms specifically
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.attach();
  }

  private attach() {
    // afterbegin inserts the new element just after the opening tag and before the first child element (none in this case)
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

// this initial form is only rendered once we instantiate ProjectInput as done below
const projInput = new ProjectInput();