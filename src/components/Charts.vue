<template>
  <mdb-container>
    <mdb-row>
      <mdb-col col="9">
        <h2 class="text-uppercase my-3">Charts</h2>

      <div v-for="alert in getVisibleCharts" v-bind:key="alert.symbol"><h5> {{ alert.symbol }} </h5><div :id="'graph_' + alert.symbol"></div></div>
      </mdb-col>
      <mdb-col col="3">
        <h3 class="text-uppercase my-3">OTB Expert</h3>
        <h6 class="my-3">
          This app is using: 
          <a href='https://mdbootstrap.com'>https://mdbootstrap.com</a>
          <a href="https://www.tradingview.com">https://www.tradingview.com</a>
          <a href="https://iexcloud.io">https://iexcloud.io</a>
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
      alerts: [],
      editingItem: {},
      data:[],
      selectedIndex: -1,
      selectedRow: null,
    }
    },
    computed: {
      getVisibleCharts(){                         
        return this.alerts.filter(p => p.email);
      },
      graphsData(){                         
        this.data.forEach( function(item, index){
            that.updateCharts(item.SymbolName, item.Intraday)
        })
      }
    },
  mounted: function () {
   this.getAlerts("alert");
  },
  methods: {
    updateCharts(symbol, data){
      const chart = createChart("graph_" + symbol, { height: 350, width: 700 });
const lineSeries = chart.addLineSeries();
lineSeries.setData(data);
    },
    getAlerts(type, request) {
      var that = this;
      fetch(this.host + type + "/list", {
        method: "GET",
        // "body": JSON.stringify(request),
        // "credentials": "same-origin",
        headers: {
          // "X-CSRF-Token": Playground.Utils.getCsrfToken()
        }
      }).then(r => {
        if (r.status === 200) {
          r.json().then(d => {
            that.alerts = d;
          });
        }
      }).then(d=> this.getCharts("stock"));
    },
    getCharts(type, request){
      var rows = this.rows;
      var that = this;
      fetch(this.host + type + "/charts/1/4", 
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
                  // that.alerts.push(item.SymbolName);
                  that.$forceUpdate()
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

