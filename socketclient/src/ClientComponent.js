
import socketIOClient from "socket.io-client";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import React, { useEffect, useState } from "react";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
const ENDPOINT = "http://127.0.0.1:4001";

am4core.useTheme(am4themes_animated);

export default function ClientComponent() {
  const [response, setResponse] = useState([ ]);

  useEffect(() => {
    
    const socket = socketIOClient(ENDPOINT);
    const stateData = [...response]
    
    let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = stateData;
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
     
        socket.on("chartRender", data => {
          stateData.push(data);
          chart.data =[...stateData]
        });
            

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.minGridDistance = 40;
        categoryAxis.fontSize = 11;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = 24000;
        valueAxis.strictMinMax = true;
        valueAxis.renderer.minGridDistance = 30;
        // axis break
        var axisBreak = valueAxis.axisBreaks.create();
        axisBreak.startValue = 2100;
        axisBreak.endValue = 22900;
        //axisBreak.breakSize = 0.005;
        axisBreak.interpolationDuration = 5000;
        // fixed axis break
        var d = (axisBreak.endValue - axisBreak.startValue) / (valueAxis.max - valueAxis.min);
        axisBreak.breakSize = 0.05 * (1 - d) / d; // 0.05 means that the break will take 5% of the total value axis height

        // make break expand on hover
        var hoverState = axisBreak.states.create("hover");
        hoverState.properties.breakSize = 1;
        hoverState.properties.opacity = 0.1;
        hoverState.transitionDuration = 1500;

        axisBreak.defaultState.transitionDuration = 1000;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "country";
        series.dataFields.valueY = "visits";
        series.columns.template.tooltipText = "{valueY.value}";
        series.columns.template.tooltipY = 0;
        series.columns.template.strokeOpacity = 0;
        series.interpolationDuration = 5000;
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
        });
  

    return ()=>{
      socket.disconnect();
      chart.dispose()
    }
  }, []);

  return (
    <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
  );
}