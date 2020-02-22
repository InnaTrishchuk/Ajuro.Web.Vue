<template>
  <mdb-container>
    <mdb-row>
      <mdb-col col="9">
        <h2 class="text-uppercase my-3">Charts</h2>

      <h5>BA</h5><div id="graph_BA"></div>
      <h5>TSLA</h5><div id="graph_TSLA"></div>
      <h5>KO</h5><div id="graph_KO"></div>
      <h5>AMD</h5><div id="graph_AMD"></div>
      <h5>NVDA</h5><div id="graph_NVDA"></div>
      <h5>TSCO</h5><div id="graph_TSCO"></div>
      <h5>ABBV</h5><div id="graph_ABBV"></div>
      <h5>PYPL</h5><div id="graph_PYPL"></div>
      <h5>GSK</h5><div id="graph_GSK"></div>
      <h5>MSFT</h5><div id="graph_MSFT"></div>
      <h5>CCL</h5><div id="graph_CCL"></div>
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
import { createChart } from '../../node_modules/lightweight-charts';
import Event from "@/components/Symbol";
export default {
  name: "Charts",
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
      host: "https://otb.expert/",
      // host: "https://localhost:5000/",
      noServer: false,
      type: "symbol",
      editingItem: {},
      data:[],
      selectedIndex: -1,
      selectedRow: null,
    }
    },
    computed: {
      graphsData(){                         
        this.data.forEach( function(item, index){
            that.updateCharts(item.SymbolName, item.Intraday)
        })
      }
    },
  mounted: function () {
   this.getItems("stock");
  },
  methods: {
    updateCharts(symbol, data){
      const chart = createChart("graph_" + symbol, { height: 350, width: 700 });
const lineSeries = chart.addLineSeries();
lineSeries.setData(data);
    },
    getItems(type, request){  
      var rows = this.rows;
      var that = this;
      fetch(this.host + type + "/charts/1/3", 
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
                var that = this;              
                d.forEach( function(item, index){
                    item.Intraday = item.Intraday.map(function(val) {
                      var current_datetime = new Date(val[0] * 1000);
                      let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
                      return {
                        
                        time: formatted_date, 
                        value: val[1]
                        };
                    });
                    that.updateCharts(item.SymbolName, item.Intraday);
                })

                  this.data = d; 
              });
            }
      });
    },
  }
}
</script>

<style>
.long-text{
  height: 300px;
}
</style>

