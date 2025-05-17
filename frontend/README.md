# manage-me

ToDo:

- [x] Edit projects
- [ ] Add dropdown with [edit, delete] to stories and tasks
- [ ] Implement drag and drop for tasks and stories
- [ ] Implement ApiUserService
- [ ] Implement tasks
- [ ] Add sidebar and header
- Implement stories functionality
  - Stories CRUD
    - [x] implement stories service
    - [x] implement stories store
  - Display stories in ProjectPage
    - [x] allow to change story status (context menu or drag and drop)
    - [x] allow to change story priority (context menu)
    - [ ] OPTIONAL: allow to filter stories by priority

Refactor ideas:

- [ ] improve naming inside stores (e.g addStory -> add)
- [ ] decrease repeatign code inside stores by extracting common entity functions (e.g. add, remove, update)
