<template>
  <div class="hiring-details-main kanban">
    <div class="page-heading d-flex align-items-center">
        <img
          @click="$router.go(-1)"
          class="pointer"
          src="../assets/backarrow.svg"
          alt=""
        />

      <div class="main-head ml-6">
        <span>{{ $route.params.name }} > Kanban View</span>
      </div>
    </div>
    <b-button class="add-new-col" style="margin-top: 8px;" v-b-modal.column-modal variant="warning"> Add New Column </b-button>
    <div class="k-container mt-3">
      <div class="d-flex kcard-maincontainer mt-2">
        <draggable
          v-model="columns"
          :options="{ group: { name: 'columns' } }"
          class="d-flex"
        >
          <div
            class="kcard-subcontainer mr-2"
            v-for="(column, index) in columns"
            :key="column.id"
          >
            <div
              :style="`background:${column.background}`"
              class="kcard-head text-center "
            >
              {{ column.name }}

              <div class="noofcands">{{ column.tasks.length }}</div>
            </div>
            <div class="kcard-sub-subcontainer">
              <button class="add-task-button add-task-button1" @click="addNewTask(index)">
                <i class="fas fa-plus"></i>   Add Task
              </button>
              
  

              <draggable
                v-model="column.tasks"
                :options="{ group: { name: 'tasks' } }"
              >
                <div v-for="(task, index) in column.tasks" :key="index">
                  <div class="kanbancards mt-3 class">
                    <div
                      :style="`background:${column.background}`"
                      class="kcard-unscheduled-colorbar ml-1 mr-1"
                    ></div>
                    <div class="d-flex align-items-center">
                     <div class="profilepic">{{ task.name }}</div>
                     <div class="ml-auto">
                      <i @click="editTask(column, task)" class="fas fa-pen mr-2 pointer"></i>
                      <i @click="deleteTask(column, task)" class="fas fa-trash pointer" ></i>
                      </div>
                    </div>

                 <div
                        class="justify-content-between align-items-center"
                      >
                        <div class="flex justify-content-space ">
                        <div class="container px-0 pt-3">
                        <div class="task-description">{{ task.description }}</div>
                        <div class="view-more text-primary" @click="openViewModal(column, task)">View More</div>
                        </div>
                        </div>
                        <div class="pointer flex-end view-more d-none" @click="openViewModal(column,task)">
                         <p>view more</p>
                         </div>
                      </div>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <b-modal
      id="task-modal"
      centered
      hide-footer
      hide-header
      no-close-on-backdrop
    >
      <div class="modalheading">
        {{ kanbanStatus === "Add" ? "Add New Task" : "Edit New Task" }}
      </div>
      <div class="xMarkCancel" @click="$bvModal.hide('task-modal')">
        <img src="../assets/xmark.svg" alt="" />
      </div>
      <hr />
      <b-row
        ><b-col>
          <div class="topDiv">
            <label class="fieldsetStyle"
              >Task Name &nbsp;<span class="asterik">*</span></label
            >
            <b-form-input
              v-model="name"
              class="inputField"
              id="input-1"
              type="text"
              placeholder="Enter here"
              autofocus
            ></b-form-input>
          </div>
        </b-col>
      </b-row>

      <div>
        <div class="topDiv mt-3 mb-2">
          <label class="fieldsetStyle">Description</label>
          <b-form-textarea
            v-model="description"
            id="textarea-large"
            class="inputField"
            size="lg"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <b-button
          class="mb-1 pl-3 pr-3"
          @click="kanbanStatus === 'Add' ? saveTask() : saveEditTask()"
        >
          {{ kanbanStatus === "Add" ? "Save" : "Update" }}
        </b-button>
      </div>
    </b-modal>
    <b-modal
      id="column-modal"
      centered
      hide-footer
      hide-header
      no-close-on-backdrop
      @show="resetColumnModal"
      @hidden="resetColumnModal"
    >
      <div class="modalheading">Add New Column</div>
      <div class="xMarkCancel" @click="$bvModal.hide('column-modal')">
        <img src="../assets/xmark.svg" alt="" />
      </div>

      <hr />
      <b-row
        ><b-col>
          <div class="topDiv mt-3 relativeclass mb-2">
            <label class="fieldsetStyle"
              >Column Name &nbsp;<span class="asterik">*</span></label
            >
            <b-form-input
              v-model="columnName"
              class="inputField"
              id="input-1"
              type="text"
              placeholder="Enter here"
              autofocus
            ></b-form-input>
          </div>
        </b-col>
      </b-row>

      <div class="d-flex align-items-center justify-content-end">
        <b-button class="mb-1 pl-3 pr-3" @click="saveColumn()">Add</b-button>
      </div>
    </b-modal>
    <b-modal id="view-more-modal">
      Column Name : {{ columnEditValues.name }}
      <div>{{taskEditValues.name}}</div>
      <div>{{taskEditValues.description}}</div>
    </b-modal>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { useStore } from "../store";

export default {
  name: "KanbanView",
  components: {
    draggable,
  },
  data() {
    return {
      name: "",
      description: "",
      columnName: "",
      kanbanStatus: "",
      kanbanIndex: null,
      columnEditValues: {},
      taskEditValues: {},
      columns: [],
    };
  },
  created() {
    // Retrieve the Kanban board data from the Pinia store and assign column array, or assign an empty array if it doesn't exist
    const { columns } = this.kanbanStore.kanbanData.find(
      (i) => i.id == this.$route.params.id
    ) || { columns: [] };

    this.columns = columns;
  },
  setup() {
    const kanbanStore = useStore();
    return { kanbanStore };
  },
  methods: {
    /**
     * Sets the index of the currently selected column and sets the kanbanStatus to "Add",
     * then shows the "task-modal" BootstrapVue modal.
     *
     * @param {Number} index - The index of the currently selected column.
     */
    addNewTask(index) {
      // Set the index of the currently selected column to the component's kanbanIndex property
      this.kanbanIndex = index;

      // Set the kanbanStatus property to "Add" to indicate that a new task is being added
      this.kanbanStatus = "Add";

      // Show the "task-modal" BootstrapVue modal
      this.$bvModal.show("task-modal");
    },

    /**
     * Saves a new task to the specified column index of the kanban board.
     */
    saveTask() {
      // Find the index of the kanban board based on the route parameter ID
      const columnIndex = this.kanbanStore.kanbanData.findIndex(
        (i) => i.id == this.$route.params.id
      );
      // Call the savekanbanTask action to save the new task, passing in the task details and the column index
      this.kanbanStore.savekanbanTask({
        index: this.kanbanIndex, // The index of the new task in the column's tasks array
        name: this.name, // The name of the new task
        description: this.description, // The description of the new task
        columnIndex, // The index of the column to add the new task to
      });

      // Hide the modal and reset the form values
      this.$bvModal.hide("task-modal");
      this.resetModal();
    },
    saveColumn() {
      // Hide the modal dialog
      this.$bvModal.hide("column-modal");

      // Find the index of the Kanban board based on the route parameter
      const columnIndex = this.kanbanStore.kanbanData.findIndex(
        (i) => i.id == this.$route.params.id
      );

      // Create a new column object
      const newColumn = {
        // Set the ID of the new column to be one greater than the current number of columns
        id: this.kanbanStore.kanbanData[columnIndex].columns.length + 1,
        // Set the name of the new column to the name entered by the user
        name: this.columnName,
        // Generate a random background color for the new column
        background: "#" + Math.random().toString(16).substr(-6),
        // Initialize the tasks array for the new column to be empty
        tasks: [],
      };

      // Call the savekanbanColumn action of the Kanban store to save the new column
      this.kanbanStore.savekanbanColumn({
        id: this.$route.params.id,
        newColumn,
      });
    },

    /**
     * Sets the modal state to "Edit" and initializes the modal form fields with the current task data.
     *
     * @param {Object} column - The column object that the task belongs to.
     * @param {Object} task - The task object to edit.
     */
    editTask(column, task) {
      // Set the kanbanStatus to "Edit" so that the modal is rendered with the appropriate header.
      this.kanbanStatus = "Edit";

      // Set the modal form fields to the current task data.
      this.name = task.name;
      this.description = task.description;

      // Set the columnEditValues and taskEditValues variables so that we can use them in the saveTask method.
      this.columnEditValues = column;
      this.taskEditValues = task;
      // Show the modal.
      this.$bvModal.show("task-modal");
    },
    saveEditTask() {
      //This line finds the index of the Kanban board in the kanbanData array of the kanbanStore that matches the ID passed in the route parameters.
      const idIndex = this.kanbanStore.kanbanData.findIndex(
        (i) => i.id == this.$route.params.id
      );

      // This line finds the index of the Kanban column in the columns array of the Kanban board found in the previous step that matches the ID of the column being edited.
      const columnIndex = this.kanbanStore.kanbanData[
        idIndex
      ].columns.findIndex((i) => i.id === this.columnEditValues.id);

      // This line finds the index of the Kanban task in the tasks array of the Kanban column found in the previous step that matches the ID of the task being edited.
      const taskIndex = this.kanbanStore.kanbanData[idIndex].columns[
        columnIndex
      ].tasks.findIndex((j) => j.id === this.taskEditValues.id);

      // This line calls the editKanbanTask action of the kanbanStore with the appropriate parameters to update the task with the new name and description.
      this.kanbanStore.editKanbanTask({
        idIndex,
        columnIndex,
        taskIndex,
        name: this.name,
        description: this.description,
      });

      // This line clears the form inputs to prepare for a new task to be added.
      this.resetModal();

      // This line hides the edit task modal once the changes have been saved.
      this.$bvModal.hide("task-modal");
    },
    // Deletes a task from the Kanban board.
    deleteTask(column, task) {
      // Find the index of the Kanban board with the ID from the route params.
      const idIndex = this.kanbanStore.kanbanData.findIndex(
        (i) => i.id == this.$route.params.id
      );
      // Find the index of the column in the Kanban board.
      const columnIndex =
        this.kanbanStore.kanbanData[idIndex].columns.indexOf(column);

      // Find the index of the task in the column.
      const taskIndex =
        this.kanbanStore.kanbanData[idIndex].columns[columnIndex].tasks.indexOf(
          task
        );
      // This line calls the editKanbanTask action of the kanbanStore to delete the task
      this.kanbanStore.deleteKanbanTask({ idIndex, columnIndex, taskIndex });
    },
    resetColumnModal() {
      this.columnName = "";
    },
    openViewModal(column, task) {
      this.columnEditValues = column;
      this.taskEditValues = task;
      this.$bvModal.show("view-more-modal");
    },
    resetModal() {
      this.name = "";
      this.description = "";
    },
  },
};
</script>

<style>
input[type="file"] {
  opacity: 0;
}
.kcard-colorbar {
  width: 4px;
  height: 130px;
  border-radius: 2px;
  position: absolute;
  background: #ffc145;
  left: 0px;
  top: 2px;
}
.kcard-unscheduled-colorbar {
  width: 4px;
  height: 95px;
  border-radius: 2px;
  position: absolute;
  left: 0px;
  top: 2px;
}

.kcard-head {
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  border-radius: 5px;
  padding: 5px;
  position: relative;

}
.kanbancards {
  background: #ffffff;
  box-shadow: 0px 4px 12px rgba(196, 196, 196, 0.5);
  border-radius: 5px;
  padding: 10px;
  /* min-height: 100px; */
  height: 100px;
  max-width: 300px;

}
.kcard-maincontainer {
  display: flex;
  overflow: auto;
}
.k-container {
  background: #ffffff;
  border-radius: 8px;
  height: calc(100vh - 150px);
  /* padding: 15px; */
}
.kcard-subcontainer {
  background: #f3f3f3;
  padding: 5px;
  border-radius: 5px;
  height: calc(100vh - 80px);

  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 320px;
}
.kcard-sub-subcontainer {
  height: calc(100vh - 130px);
  overflow: auto;
}

.page-title {
  padding: 10px;
  margin-bottom: 10px;
  /* add other styles as needed */
}

</style>
