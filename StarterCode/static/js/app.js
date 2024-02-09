let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
let global_data;

d3.json(url).then(function(data){
    //step 1 - Get the data
    console.log(data);
    global_data=data; //set global data variable for use in the on change option

    //step2 - populate the dropdown 
    //use D3 to select the dropdown
    let dropdown = d3.select("#selDataset");

    for (let i = 0; i< data.names.length; i++){
        let name = data.names[i];
        dropdown.append("option").text(name);
    }

    //step3 -grab data for specific person
    let person = data.names[0];
    let person_data = data.samples.filter(row => row.id === person)[0];
    let meta_data = data.metadata.filter(row => row.id == person)[0];

    console.log(meta_data);

    //make bar chart
    makeBar(person_data);
    makeBubble(person_data);
    makeMeta(meta_data);
    makeGauge(meta_data);
});

function makeMeta(meta_data) {
    let panel = d3.select("#sample-metadata");
    panel.html("");

    //loop through each key
    let keys = Object.keys(meta_data);
    for (let i = 0; i< keys.length; i++){
        let key = keys[i];
        panel.append("p").text(`${key}: ${meta_data[key]}`);
    }
}

function makeGauge(meta_data){
    let trace1 = {
        domain: { x: [0, 1], y: [0, 1] },
        value: meta_data["wfreq"],
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 5 },
        gauge: {
            axis: { range: [null, 10] },
            steps: [
                { range: [0, 5], color: "lightgray" },
                { range: [5, 8], color: "gray" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 9.5
            }
        }
    }

let traces = [trace1];
let layout = {};
Plotly.newPlot('gauge', traces, layout);

}

function makeBar(person_data){
        //step4 - given data make a bar chart
        let sampleValues = person_data.sample_values.slice(0, 10).reverse();
        let otuIds = person_data.otu_ids.slice(0, 10).reverse();
        let otuLabels = person_data.otu_labels.slice(0,10).reverse();
    
        let trace1 = {
            x:sampleValues,
            y:otuIds.map(id => `OTU ${id}`),
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };
    
        let traces = [trace1];
    
        let layout = {
            title: "Top Ten OTUs",
            xaxis: {title: "Sample Values"},
            yaxis: {title: "OTU IDs"}
        };
    
        Plotly.newPlot("bar", traces, layout);
}

function makeBubble(person_data){
    let sampleValues = person_data.sample_values;
    let otuIds = person_data.otu_ids;
    let otuLabels = person_data.otu_labels;

    let trace1 = {
        x:otuIds,
        y:sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
            color: otuIds,
            size: sampleValues
        }
    };

    let traces = [trace1];

    let layout = {
        title: "OTUs Observed",
        xaxis: {title: "OTU IDs"},
        yaxis: {title: "Number of Observed"}
    };

    Plotly.newPlot("bubble", traces, layout);

}

function optionChanged(person){
    let person_data = global_data.samples.filter(row => row.id === person)[0];
    let meta_data = global_data.metadata.filter(row => row.id == person)[0];

    //make bar chart
    makeBar(person_data);
    makeBubble(person_data);
    makeMeta(meta_data);
    makeGauge(meta_data);
}

//populate the dropdown

//create textbox

//create the bubble plot

//create a bar chart