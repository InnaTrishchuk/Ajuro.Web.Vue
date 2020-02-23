<template>
  <mdb-container>
    <mdb-row>
      <mdb-col col="9">
        <h2 class="text-uppercase my-3">Symbols</h2>
       <mdb-datatable 
          ref="mdbt" 
          :data="table_data" 
          :rows="rows" 
          v-on:selectRow="selectRow($event)"
          v-on:dblclick="rowDblclick($event)"
          striped
          bordered
          materialInputs
          responsive
          focus
      arrows
      :display="3"
      reactive: false
      :time="1000"
          @selectRow="selected = table_data.rows[$event]"
  />
        <input type="button" :class="this.selectedIndex < 0 ? '': 'btn-danger'" :disabled="this.selectedIndex < 0" class='btn' value="Delete" v-on:click="deleteRowRequested()">
        <input type="button" :class="this.selectedIndex < 0 ? '': 'btn-primary'" :disabled="this.selectedIndex < 0" class='btn' value="Edit" v-on:click="editRow()">
        <input type="button" class='btn btn-success' value="Add" v-on:click="addRow()">
      </mdb-col>
      <mdb-col col="3">
        <h3 class="text-uppercase my-3">OTB Expert</h3>
        <h6 class="my-3">
          This app is using: <a href='https://mdbootstrap.com'>https://mdbootstrap.com</a>
        </h6>
        <h1 class="my-3">
          <mdb-row>
            <mdb-col col="3" class="text-center">
              <mdb-icon far icon="sun"/>
            </mdb-col>
            <mdb-col col="9">Sunny</mdb-col>
          </mdb-row>
          <mdb-row>
            <mdb-col col="3" class="text-center">
              <mdb-icon icon="thermometer-three-quarters"/>
            </mdb-col>
            <mdb-col col="9">23°C</mdb-col>
          </mdb-row>
        </h1>
        <p>
          Don't forget your sunglasses. Today will dry and sunny, becoming
          warm in the afternoon with temperatures of between 20 and 25
          degrees.
        </p>
        {{ this.selectedRow ? this.selectedRow : null }}
      </mdb-col>
    </mdb-row>

    <mdb-modal v-if="modal" @close="modal = false">
      <mdb-modal-header>
        <mdb-modal-title tag="h4" class="w-100 text-center font-weight-bold"><span v-if='isNew'>Add new</span><span v-else>Edit</span> item</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <form class="mx-3 grey-text">
          <mdb-input v-if="editingItem.id >= 0"
            name="id"
            type="number"
            disabled="true"
            v-model="editingItem.id"
            v-on:dblclick="rowDblclick()"
            @input="handleInput($event, 'id')"
          />
          <mdb-input 
            name="Name"
            type="text"
            label="Share name"
            v-model="editingItem.name"
            v-on:dblclick="rowDblclick()"
            @input="handleInput($event, 'name')"
          />
          <mdb-input 
            name="Market"
            label="Market of the share"
            type="text"
            v-model="editingItem.market"
            v-on:dblclick="rowDblclick()"
            @input="handleInput($event, 'market')"
          />
          <mdb-input 
            name="Active"
            label="Is pooling active"
            type="checkbox"
            v-model="editingItem.email"
            v-on:dblclick="rowDblclick()"
            @input="handleInput($event, 'active')"
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
import Event from "@/components/Symbol";
export default {
  name: "Symbols",
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
      // host: "https://otb.expert/",
      host: "https://localhost:5000/",
      noServer: false,
      type: "symbol",
      editingItem: {},
      selectedIndex: -1,
      selectedRow: null,
      tableProps: { dark: true, borderless: true }, 
      events: [
        {
          symbolId: "10:00",
          title: "Breakfast with Simon",
          location: "Lounge Caffe",
          description: "Discuss Q3 targets"
        }
      ],
      modal: false,
      newValues: [], 
      rows: [],     
          
          // id, symbol, target, quantity, value, price, email

          columns: [
            {
              label: 'Id',
              field: 'id',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Name',
              field: 'name',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Value',
              field: 'value',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Quantity',
              field: 'quantity',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Market',
              field: 'market',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Updated',
              field: 'updated',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            },
            {
              label: 'Active',
              field: 'active',
              sort: 'asc',
              clickEvent: () => this.tableCellSelected($event, params)
            }
          ]
    }
    },
    computed: {
      table_data() {
        return {
          columns: this.columns,
          rows: this.rows,
          // reactiveFlag: true,
          // interval: 10,
      };
      },
    },
  mounted: function () {
   this.getItems("symbol");
  },
  methods: {
    rowDblclick(event){
      this.selectRow(event);
      this.editItem(this.selectedRow); 
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
        if(this.editingItem.symbolId < 0)
        {
          this.editingItem.symbolId = this.getRandomInt(1000);
          this.table_data.rows.push(this.editingItem);
          console.log('SIMULATE: Add item');
        }
        else{
          console.log('SIMULATE: Update item');
        }
      }
      else
      {      
        fetch(this.host + this.type + "/update" ,//+ "/delete", 
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
      
      fetch(this.host + this.type + "/delete" ,//+ "/delete", 
      {
        "method": "DELETE",
        // "body": JSON.stringify(request),
        // "credentials": "same-origin",
        "headers": {
          // "X-CSRF-Token": Playground.Utils.getCsrfToken()
        }
      }).then(r => {
            if (r.status === 200) {
                r.json().then(d => {
                  // d.forEach(r=>r.actions='<input type="button" class="btn tbledit" value="Edit" onclick="editRow('+ r.id +')">');                  
                d.map(row => this.rows.push(row));
                    var i = this.$refs.mdbt.interval;
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
      var rows = this.rows;
      /*
                  var d = [
                    { id: 1, symbol: "AAPL", target: 20, quantity: 3, value: 6, price: 5, email: true },
                    { id: 2, symbol: "GOOG", target: 30, quantity: 2, value: 8, price: 3, email: true }
                  ];
                  // d.forEach(r=>r.actions='<input type="button" class="btn tbledit" value="Edit" onclick="editRow('+ r.id +')">');
                  var columns =  this.table_data.columns; 
                   this.table_data = { columns: columns, rows: d };
                    // this.$refs.mdbt.data = this.table_data;
                     this.$refs.mdbt.$attrs.rows = this.table_data;
                return;
      */
      // fetch("https://localhost:5000/" + type + "/list", 
      fetch(this.host + type + "/list", 
      {
        "method": "GET",
        // "body": JSON.stringify(request),
        // "credentials": "same-origin",
        "headers": {
          // "X-CSRF-Token": Playground.Utils.getCsrfToken()
        }
      }).then(r => {
            if (r.status === 200) {
                r.json().then(d => {
                  // d.forEach(r=>r.actions='<input type="button" class="btn tbledit" value="Edit" onclick="editRow('+ r.id +')">');                  
                d.map(row => this.rows.push(row));
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
        symbolId: this.newValues["time"],
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

