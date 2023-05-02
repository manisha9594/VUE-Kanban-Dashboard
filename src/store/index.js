import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "kanban",
  state: () => ({
    kanbanData: [
      {
        id: 1,
        name: "Project A",
        columns: [
          { id: 1, name: "To Do", background: "#2a92bf", tasks: [] },
          { id: 2, name: "In Progress", background: "#ffc145", tasks: [] },
          { id: 3, name: "Done", background: "#038e00", tasks: [] },
        ],
      },
      {
        id: 2,
        name: "Project B",
        columns: [
          { id: 1, name: "To Do", background: "#2a92bf", tasks: [] },
          { id: 2, name: "In Progress", background: "#ffc145", tasks: [] },
          { id: 3, name: "Done", background: "#038e00", tasks: [] },
        ],
      },
      {
        id: 3,
        name: "Project C",
        columns: [
          { id: 1, name: "To Do", background: "#2a92bf", tasks: [] },
          { id: 2, name: "In Progress", background: "#ffc145", tasks: [] },
          { id: 3, name: "Done", background: "#038e00", tasks: [] },
        ],
      },
    ],
  }),

  getters: {
    getBoardData: (state) => state.kanbanData,
  },
  actions: {
    saveKanbanCard(post) {
      this.kanbanData.push(post);
    },
    savekanbanColumn({ id, newColumn }) {
      const index = this.kanbanData.findIndex((i) => i.id == id);
      this.kanbanData[index].columns.push(newColumn);
    },
    savekanbanTask({ columnIndex, index, name, description }) {
      this.kanbanData[columnIndex].columns[index].tasks.push({
        id: this.kanbanData[columnIndex].columns[index].tasks.length + 1,
        name: name,
        description: description,
      });
    },
    editKanbanTask({ idIndex, columnIndex, taskIndex, name, description }) {
      this.kanbanData[idIndex].columns[columnIndex].tasks[taskIndex].name =
        name;
      this.kanbanData[idIndex].columns[columnIndex].tasks[
        taskIndex
      ].description = description;
    },
    deleteKanbanTask({ idIndex, columnIndex, taskIndex }) {
      this.kanbanData[idIndex].columns[columnIndex].tasks.splice(taskIndex, 1);
    },
  },
});
