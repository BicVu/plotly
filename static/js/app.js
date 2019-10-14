function buildMetadata(sample) {
  // Build a drop down menu of key values that returns paragraph statements of values
  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  d3.json(url).then(function(response) {
     // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata"); //finding location
      // Use `.html("") to clear any existing metadata
      selector.html(""); //clearing
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(response).forEach(function([key,value]){
        selector.append("p") // loop through all rows "p" paragraph tag
        .text(`${key}: ${value}`);
      });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
} // Close buildMetadata(sample)

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;
    // @TODO: Build a Bubble Chart using the sample data
  d3.json(url).then(function(response) {
    // var data = response // var data = response
    console.log(response)
    // Pie Chart
    var trace1 = {
      labels: response.otu_ids.slice(0,10),
      values: response.sample_values.slice(0,10),
      type: 'pie'
    };
    var layout = {
      title: 'Top 10 Operational Taxonomic Units (OTU)',
      width: 500,
      height: 500,
      showlegend: true,
      legend: {
        x: 1,
        y: 0.5 // places legend outside the plot
      }
    }
    var data1 = [trace1]
    Plotly.newPlot('pie', data1, layout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // Bubble chart
    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      // type: "scatter",
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };
    var layout = {
      title: 'OTU Distribution',
      xaxis: { title: 'OTU ID'},
      yaxis: { title: 'Sample Size'},
      showlegend: false,
      // height: 600, // NOT specifying size of div will cause to span width of window
      // width: 800
    };
    var data2 = [trace2]
    Plotly.newPlot('bubble', data2, layout);

  });
} // Close buildCharts

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
