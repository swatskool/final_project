var json_file = "../static/js/json_data.json"

anychart.onDocumentReady(function(update_sankey)
// function update_sankey()
 {
    //connect to collect data from json
       d3.json(json_file).then(function (data) {
 
       // var category_filter = data.filter(sampleCategory => sampleCategory.game_data.game_category == dd1)
 
       var sankey_data = []
       var data1 = {}
 
       for (var i = 0; i < 40; i++) {
          data1 = { from: data[i].game, to: data[i].game_data.game_category, weight: parseInt(data[i].game_data.user_count) }
          sankey_data.push(data1)
       }//closes for loop
    
 console.log(sankey_data)

//calling the Sankey function
var sankey_chart = anychart.sankey(sankey_data);
//customizing the width of the nodes
sankey_chart.nodeWidth("25%");
//setting the chart title
sankey_chart.title("Sankey Diagram: Games in Different Categories by Number of Users");
//customizing the vertical padding of the nodes
sankey_chart.nodePadding(35);
//setting the container id
sankey_chart.container("container");
//initiating drawing the Sankey diagram
sankey_chart.draw();
// });
})//closes function   
});//closes update_sankey

// update_sankey();