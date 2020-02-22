<template>
  <mdb-container>
    
      <p>
        <router-link to="/Charts">Charts</router-link>
        <router-link to="/Symbols">Symbols</router-link>
        <router-link to="/Alerts">Alerts</router-link>
      </p>
      
      <router-view></router-view>

    <mdb-modal v-if="modal" @close="modal = false">
      <mdb-modal-header>
        <mdb-modal-title tag="h4" class="w-100 text-center font-weight-bold"><span v-if='isNew'>Add new</span><span v-else>Edit</span> item</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <form class="mx-3 grey-text">
          <mdb-input v-if="editingItem.id >= 0"
            name="id"
            label="Id (readonly)"
            disabled=true
            type="text"
            v-model="editingItem.id"
            v-on:dblclick="rowDblclick()"
            @input="handleInput($event, 'id')"
          />
          <mdb-input
            name="tags"
            label="Tags"
            icon="edit"
            placeholder=""
            type="text"
            v-model="editingItem.tags"
            v-on:dblclick="rowDblclick()"
            @input="handleInput($event, 'tags')"
          />
          <mdb-input
            name="title"
            label="Title"
            icon="edit"
            placeholder=""
            type="text"
            v-model="editingItem.title"
            v-on:dblclick="rowDblclick()"
            @input="handleInput($event, 'title')"
          />
          <mdb-textarea
            name="description"
            label="Description (optional)"
            v-model="editingItem.description"
            icon="sticky-note"
            @input="handleInput($event, 'description')"
          />
          <mdb-textarea
            name="text"
            label="Template"
            rows=5
            max-rows=10
            v-model="editingItem.text"
            icon="sticky-note"
            @input="handleInput($event, 'text')"
          />
        </form>
      </mdb-modal-body>
      <mdb-modal-footer class="justify-content-center">
        <mdb-btn v-if="isNew" color="info" v-on:click="saveItemRequested()">Add</mdb-btn>
        <mdb-btn v-else color="info" v-on:click="saveItemRequested()">Update</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>

  </mdb-container>
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbIcon,
  mdbBtn,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  mdbInput,
  mdbTextarea,
  mdbDatatable 
} from "mdbvue";
import Event from "@/components/Event";
export default {
  name: "App",
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon,
    mdbBtn,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbInput,
    mdbTextarea,
    Event,
    mdbDatatable
  },
  data() {
    return{
    
      noServer: true,
     editingItem: {},
      selectedIndex: -1,
      selectedRow: null,
         tableProps: {dark: true, borderless: true}, 
      events: [
        {
          time: "10:00",
          title: "Breakfast with Simon",
          location: "Lounge Caffe",
          description: "Discuss Q3 targets"
        },
        {
          time: "10:30",
          title: "Daily Standup Meeting (recurring)",
          location: "Warsaw Spire Office"
        },
        {
          time: "11:00",
          title: "Call with HRs"
        },
        {
          time: "12:00",
          title: "Lunch with Timmoty",
          location: "Canteen",
          description: "Project evalutation "
        }
      ],
      modal: false,
      newValues: [], 
      rows: [],     
        table_data: {
          reactiveFlag: true,
          interval: 10,
          columns: [
            {
              label: 'Id',
              field: 'id',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Tags',
              field: 'tags',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Title',
              field: 'title',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Description',
              field: 'description',
              sort: 'asc'
            },
            /*{
              label: 'Actions',
              field: 'actions',
              sort: 'asc'
            }*/
          ],
          rows: [
           {id: 8,tags: "2t", title: "title", description: "description" }
            ]
        }
   
    }
  },
  mounted: function () {
   this.getItems("snippets");
  },
  methods: {
       rowDblclick(event){
      var s =0;
    },
    tableCellSelected(event, params){
      var s = 0;
    },
    selectRow(event){
      this.selectedIndex = event;
      this.selectedRow = this.table_data.rows[this.selectedIndex]
    },
    addRow()
    { 
     this.editItem({ id: -1 }, true);    
    },
    editRow(id = null)
    {     
      if(id)
      {
        this.selectedRow = this.table_data.rows.find(p=>p.id = id);
      } 
      if(this.selectedIndex < 0)
      {
        return;
      } 
      this.editItem(this.selectedRow); 
    },
    editItem(item, isNew = false){
      this.isNew = isNew;
      this.editingItem = item;
      this.modal = true;
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    saveItemRequested(){
      this.modal = false;
      if(this.noServer)
      {
        if(this.editingItem.id < 0)
        {
          this.editingItem.id = this.getRandomInt(1000);
          this.table_data.rows.push(this.editingItem);
          console.log('SIMULATE: Add item');
        }
        else{
          console.log('SIMULATE: Update item');
        }
      }
      else
      {      
        fetch("http://localhost:8080/drops/composer.php?seve&type=" + type, 
        {
          "method": "POST",
          "body": JSON.stringify(this.editingItem),
          // "credentials": "same-origin",
          "headers": {
            "Content-Type": "application/json",
            // "X-CSRF-Token": Playground.Utils.getCsrfToken()
          }
        }).then(r => {
              if (r.status === 200) {
                  r.json().then(d => {
                    console.log('Save succeded!');
                  });
              }
        });
      }
    },
    deleteRowRequested()
    {     
      if(this.selectedIndex < 0)
      {
        console.log('ERROR: No item selected for deletion');
        return;
      }
       if(this.noServer)
       {
          // Alternative:
          // this.table_data.rows.splice(this.selectedIndex, 1, this.editingItem);
         this.deleteItemSucceded(this.selectedRow.id);
         return;
       }
      
      fetch("http://localhost:8080/drops/composer.php?list&type=" + type, 
      {
        "method": "GET",
        // "body": JSON.stringify(request),
        // "credentials": "same-origin",
        "headers": {
          "Content-Type": "application/json",
          // "X-CSRF-Token": Playground.Utils.getCsrfToken()
        }
      }).then(r => {
            if (r.status === 200) {
                r.json().then(d => {
                  // d.forEach(r=>r.actions='<input type="button" class="btn tbledit" value="Edit" onclick="editRow('+ r.id +')">');
                  
                });
            }
      });
    },
    remove(array, value) {
        const index = array.findIndex(obj => obj.id === value);
        return index >= 0 ? [
            array.slice(0, index),
            array.slice(index + 1)
        ] : array;
    },
    deleteItemSucceded(id)
    {
      // this.table_data.rows.filter(e => !ids.includes(e.id));
      const index = this.table_data.rows.findIndex(obj => obj.id === id);
      if(index > -1){
        this.table_data.rows.splice(index, 1);
        console.log('SUCCESS: Delete by id: ' + id);
        this.selectedIndex = -1;
        this.selectedRow = null;
        // this.remove(this.table_data.row, id);
      }
      else{
        console.log('ERROR: No such index to delete for id: ' + id);
      }
      /*
     this.table_data.rows.forEach(data, function(i, el){
        if (this.id == id){
          this.table_data.row.splice(, );
        }
      });
      */
    },
    getItems(type, request){  
      fetch("http://localhost:8080/drops/composer.php?list&type=" + type, 
      {
        "method": "GET",
        // "body": JSON.stringify(request),
        // "credentials": "same-origin",
        "headers": {
          "Content-Type": "application/json",
          // "X-CSRF-Token": Playground.Utils.getCsrfToken()
        }
      }).then(r => {
            if (r.status === 200) {
                r.json().then(d => {
                  // d.forEach(r=>r.actions='<input type="button" class="btn tbledit" value="Edit" onclick="editRow('+ r.id +')">');
                  var columns =  this.table_data.columns; 
                   this.table_data = { columns: columns, rows:d };
                    var i = this.$refs.mdbt.interval;
                });
            }
      });
    },
    handleInput(val, type) {
      this.newValues[type] = val;
    },
    addEvent() {
      this.events.push({
        time: this.newValues["time"],
        title: this.newValues["title"],
        location: this.newValues["location"],
        description: this.newValues["description"]
      });
  }
  }
};
</script>

<style>
.long-text{
  height: 300px;
}
</style>

