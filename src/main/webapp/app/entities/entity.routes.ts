import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'team',
    data: { pageTitle: 'rosterv2App.team.home.title' },
    loadChildren: () => import('./team/team.routes'),
  },
  {
    path: 'team-plan',
    data: { pageTitle: 'rosterv2App.teamPlan.home.title' },
    loadChildren: () => import('./team-plan/team-plan.routes'),
  },
  {
    path: 'resource',
    data: { pageTitle: 'rosterv2App.resource.home.title' },
    loadChildren: () => import('./resource/resource.routes'),
  },
  {
    path: 'resource-plan',
    data: { pageTitle: 'rosterv2App.resourcePlan.home.title' },
    loadChildren: () => import('./resource-plan/resource-plan.routes'),
  },
  {
    path: 'shift-demand',
    data: { pageTitle: 'rosterv2App.shiftDemand.home.title' },
    loadChildren: () => import('./shift-demand/shift-demand.routes'),
  },
  {
    path: 'task',
    data: { pageTitle: 'rosterv2App.task.home.title' },
    loadChildren: () => import('./task/task.routes'),
  },
  {
    path: 'facility',
    data: { pageTitle: 'rosterv2App.facility.home.title' },
    loadChildren: () => import('./facility/facility.routes'),
  },
  {
    path: 'shift-type',
    data: { pageTitle: 'rosterv2App.shiftType.home.title' },
    loadChildren: () => import('./shift-type/shift-type.routes'),
  },
  {
    path: 'ref-calendar',
    data: { pageTitle: 'rosterv2App.refCalendar.home.title' },
    loadChildren: () => import('./ref-calendar/ref-calendar.routes'),
  },
  {
    path: 'resource-training',
    data: { pageTitle: 'rosterv2App.resourceTraining.home.title' },
    loadChildren: () => import('./resource-training/resource-training.routes'),
  },
  {
    path: 'training',
    data: { pageTitle: 'rosterv2App.training.home.title' },
    loadChildren: () => import('./training/training.routes'),
  },
  {
    path: 'position-requirement',
    data: { pageTitle: 'rosterv2App.positionRequirement.home.title' },
    loadChildren: () => import('./position-requirement/position-requirement.routes'),
  },
  {
    path: 'position',
    data: { pageTitle: 'rosterv2App.position.home.title' },
    loadChildren: () => import('./position/position.routes'),
  },
  {
    path: 'department',
    data: { pageTitle: 'rosterv2App.department.home.title' },
    loadChildren: () => import('./department/department.routes'),
  },
  {
    path: 'shift',
    data: { pageTitle: 'rosterv2App.shift.home.title' },
    loadChildren: () => import('./shift/shift.routes'),
  },
  {
    path: 'shift-template',
    data: { pageTitle: 'rosterv2App.shiftTemplate.home.title' },
    loadChildren: () => import('./shift-template/shift-template.routes'),
  },
  {
    path: 'role',
    data: { pageTitle: 'rosterv2App.role.home.title' },
    loadChildren: () => import('./role/role.routes'),
  },
  {
    path: 'resource-roles',
    data: { pageTitle: 'rosterv2App.resourceRoles.home.title' },
    loadChildren: () => import('./resource-roles/resource-roles.routes'),
  },
  {
    path: 'ref-rotation',
    data: { pageTitle: 'rosterv2App.refRotation.home.title' },
    loadChildren: () => import('./ref-rotation/ref-rotation.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
