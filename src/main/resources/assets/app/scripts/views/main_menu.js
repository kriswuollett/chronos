define([
  'jquery',
  'backbone',
  'underscore',
  'views/bound_view',
  'd3',
  'hbs!templates/main_menu'
],
function($,
         Backbone,
         _,
         BoundView,
         MainMenuTpl) {

  var MainMenu;

  MainMenu = BoundView.extend({
    el: "#main-menu",
    template: MainMenuTpl,

    events: {
      'submit #search-form': 'submitSearchForm'
    },

    getBindModels: function() {
      return {
        jobs: this.collection
      };
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);

      this.addRivets();
      this.trigger('render');

      return this;
    },

    submitSearchForm: function(e) {
      e && e.preventDefault();
      return false;
    },

    drawHorizontalBarChart: function(chartID, dataSet, selectString, numJobs) {

            // chartID => A unique drawing identifier that has no spaces, no "." and no "#" characters.
            // dataSet => Input Data for the chart, itself.
            // selectString => String that allows you to pass in
            //           a D3 select string.
            // numJobs => The number of bars to render
            numJobs = Math.min(dataSet.length, numJobs);
            var canvasWidth = 700;
            var barsWidthTotal = 300
            var barHeight = 20;
            var barsHeightTotal = barHeight * numJobs;
            var canvasHeight = numJobs * barHeight + 10; // +10 puts a little space at bottom.
            var legendOffset = barHeight/2;
            var legendBulletOffset = 30;
            var legendTextOffset = 20;
            var maxTime = d3.max(dataSet, function(d) {return d.time; })
            var minTime = d3.min(dataSet, function(d) {return d.time; })
            var x = d3.scale.linear().domain([0, maxTime]).rangeRound([0, barsWidthTotal]);
            var y = d3.scale.linear().domain([0, numJobs]).range([0, barsHeightTotal]);

            // Color Scale Handling...
            var colorScale = d3.scale.linear().range(["seagreen", "orangered"]).interpolate(d3.interpolateHcl)

            var synchronizedMouseOver = function() {
              var bar = d3.select(this);
              var indexValue = bar.attr("index_value");

              var barSelector = "." + "bars-" + chartID + "-bar-" + indexValue;
              var selectedBar = d3.selectAll(barSelector);
              selectedBar.style("fill", "Maroon");

              var textSelector = "." + "bars-" + chartID + "-legendText-" + indexValue;
              var selectedLegendText = d3.selectAll(textSelector);
              selectedLegendText.style("fill", "Maroon");
            };

            var synchronizedMouseOut = function() {
              var bar = d3.select(this);
              var indexValue = bar.attr("index_value");

              var barSelector = "." + "bars-" + chartID + "-bar-" + indexValue;
              var selectedBar = d3.selectAll(barSelector);
              var colorValue = selectedBar.attr("color_value");
              selectedBar.style("fill", colorValue);

              var textSelector = "." + "bars-" + chartID + "-legendText-" + indexValue;
              var selectedLegendText = d3.selectAll(textSelector);
              selectedLegendText.style("fill", "Blue");
            };

          // Create the svg drawing canvas...
          var canvas = d3.select(selectString)
            .append("svg:svg")
              //.style("background-color", "yellow")
              .attr("width", canvasWidth)
              .attr("height", canvasHeight);

          // Draw individual hyper text enabled bars...
          canvas.selectAll("rect")
            .data(dataSet)
            .enter().append("svg:a")
              .attr("xlink:href", function(d) { return d.link; })
              .append("svg:rect")
                // NOTE: the "15 represents an offset to allow for space to place time
                // at end of bars.  May have to address this better, possibly by placing the
                // time within the bars.
                //.attr("x", function(d) { return barsWidthTotal - x(d.time) + 15; }) // Left to right
                .attr("x", 0) // Right to left
                .attr("y", function(d, i) { return y(i); })
                .attr("height", barHeight)
                .on('mouseover', synchronizedMouseOver)
                .on("mouseout", synchronizedMouseOut)
                .style("fill", "White" )
                .style("stroke", "White" )
                .transition()
    	      .ease("bounce")
                  .duration(1500)
                  .delay(function(d, i) { return i * 100; })
                .attr("width", function(d) { return x(d.time); })
                .style("fill", function(d, i) { colorVal = colorScale((d.time - minTime)/(maxTime - minTime)); return colorVal; } )
                .attr("index_value", function(d, i) { return "index-" + i; })
                .attr("class", function(d, i) { return "bars-" + chartID + "-bar-index-" + i; })
                .attr("color_value", function(d, i) { return colorScale((d.time - minTime)/(maxTime - minTime)); }) // Bar fill color...
                .style("stroke", "white"); // Bar border color...


          // Create text values that go at end of each bar...
          canvas.selectAll("text")
            .data(dataSet) // Bind dataSet to text elements
            .enter().append("svg:text") // Append text elements
              .attr("x", x)
              .attr("y", function(d, i) { return y(i); })
              //.attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
              .attr("dx", function(d) { return x(d.time) - 5; })
              .attr("dy", barHeight-5) // vertical-align: middle
              .attr("text-anchor", "end") // text-align: right
              .text(function(d) { return d.time;})
              .attr("fill", "White");

          // Create hyper linked text at right that acts as label key...
          canvas.selectAll("a.legend_link")
            .data(dataSet) // Instruct to bind dataSet to text elements
            .enter().append("svg:a") // Append legend elements
              .attr("xlink:href", function(d) { return d.link; })
                .append("text")
                  .attr("text-anchor", "center")
                  .attr("x", barsWidthTotal + legendBulletOffset + legendTextOffset)
                  //.attr("y", function(d, i) { return legendOffset + i*20 - 10; })
                  .attr("y", function(d, i) { return legendOffset + i*barHeight; } )
                  .attr("dx", 0)
                  .attr("dy", "5px") // Controls padding to place text above bars
                  .text(function(d) { return d.jobNameLabel;})
                  .style("fill", "White")
                  .attr("index_value", function(d, i) { return "index-" + i; })
                  .attr("class", function(d, i) { return "bars-" + chartID + "-legendText-index-" + i; })
                  .on('mouseover', synchronizedMouseOver)
                  .on("mouseout", synchronizedMouseOut);

          }

  });

  return MainMenu;
});
