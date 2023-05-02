<template>
  <div class="main-container">
    <b-row class="justify-content-between" align-h="end">
      <b-col cols="4"> <h2 class="main-heading" style = "float:left">Kanban Boards</h2></b-col>
      <b-col cols="4">
        <b-button variant="warning" style = "float:right" v-b-modal.modal-prevent-closing
          >Create New Board</b-button
        ></b-col
      >
    </b-row>

    <div
      class="mt-3"
      v-for="(data, index) in kanbanStore.getBoardData"
      :key="index"
    >
      <b-card style="background-color: whitesmoke; border-color: green; box-shadow: 0 3px 8px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)" title="Board Name">
        <b-card-text> {{ data.name }} </b-card-text>
        Total Task:<span class="task-count" style="color:Red"> {{data.columns.reduce((acc, curr) => acc + curr.tasks.length, 0)}}</span>
        <b-button variant="primary" class="btn btn-success goto-kanban-button goto-kanban-button1 " @click="goToBoard(data)"
          >Go To Kanban</b-button
        >
      </b-card>
    </div>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="New Board Name"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name-input"
          :invalid-feedback="errorValue"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            placeholder="Enter Name"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { useStore } from "../store";

export default {
  data() {
    return {
      name: "",
      nameState: null,
      errorValue: "Name is required",
    };
  },
  setup() {
    const kanbanStore = useStore();
    return { kanbanStore };
  },

  created () {
    console.log(this.kanbanStore);;
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      if (valid) {
        this.errorValue = "Name is required";
      }
      return valid;
    },
    resetModal() {
      this.name = "";
      this.nameState = null;
      this.errorValue = "Name is required";
    },
    handleOk(e) {
      // Prevent modal from closing
      e.preventDefault();
      const checkDuplicate = this.kanbanStore.kanbanData.some(
        (board) => board.name === this.name
      );
      if (checkDuplicate) {
        this.nameState = false;
        this.errorValue =
          "A board with this name already exists. Please choose a different name";
        return;
      }
      // Trigger submit handler
      this.handleSubmit();
    },
    /**
     * Handles the submit event of the kanban name form.
     * If form is valid, creates a new kanban board and adds it to the kanban name store.
     * Hides the modal form after successful submission.
     */
    handleSubmit() {
      // check if the form is valid
      if (!this.checkFormValidity()) {
        return;
      }
      // create a new kanban board object
      const newBoard = {
        id: this.kanbanStore.getBoardData.length + 1, // Generate a new ID by getting the number of existing board names and adding 1
        name: this.name, // Use the name entered in the form
        columns: [
          { id: 1, name: "To Do", background: "#2a92bf", tasks: [] },
          { id: 2, name: "In Progress", background: "#ffc145", tasks: [] },
          { id: 3, name: "Done", background: "#038e00", tasks: [] },
        ],
      };
      // add the new board to the kanban name store
      this.kanbanStore.saveKanbanCard(newBoard);

      // hide the modal form
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    goToBoard(data) {
      this.$router.push({ path: `/kanban/${data.id}/${data.name}` });
    },
  },
};
</script>

<style>
</style>