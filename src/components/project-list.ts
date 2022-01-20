import { Project, ProjectStatus } from '../models/project.js';
import { Component } from './base-component.js';
import { Autobind } from '../decorators/autobind.js';
import { DragTarget } from '../models/drag-drop.js';
import { projectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';

// ProjectList Class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: 'active' | 'completed') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const projId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      projId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Completed
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((proj) => {
        if (this.type === 'active') {
          return proj.status === ProjectStatus.Active;
        }
        return proj.status === ProjectStatus.Completed;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projItem);
    }
  }
}
