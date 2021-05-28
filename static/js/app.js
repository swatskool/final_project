var btn=d3.select('btn_submit')
btn.on('click', function(){
   console.log('hi')
})


var json_file = "../static/js/json_data.json"

var svgWidth = 1350
var svgHeight = 700

var margin = { top: 100, right: 30, bottom: 140, left: 120 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#viz")
   .append("svg")
   .attr("width", svgWidth)
   .attr("height", svgHeight)
   .attr("position", "relative")
   .attr("style", "background-color:smoke")
   .attr("style", "background-size:100% 100%")
   .append("g")
   .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x = d3.scaleBand()
   .range([0, width])
   .padding(0.2);

var xAxis = svg.append("g")
   .attr("transform", "translate(0," + height + ")")

// Add Y axis
var y = d3.scaleLinear()
   .range([height, 0]);
var yAxis = svg.append("g")
   .attr("class", "myYaxis")

function init() {

   d3.json(json_file).then(data => {
      var game_name = data.game;
      //  var dd1 = d3.select("#dd1");
      var dd1 = d3.select("#dd1").property('value')

      buildCharts(dd1);
   });// close d3 call
}; //close init


// Creates/updates the plot for a given variable:
function update(data) {
   // Update the X axis
   x.domain(data.map(function (d) { return d.group; }))
   xAxis.call(d3.axisBottom(x))

   // Update the Y axis
   y.domain([0, d3.max(data, function (d) { return d.value })]);
   yAxis.transition().duration(1000).call(d3.axisLeft(y));

   // Create the update variable
   var update_svg = svg.selectAll("rect")
      .data(data)

   update_svg
      .enter()
      .append("rect") // Add a new rect for each new element
      .merge(update_svg) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr("x", function (d) { return x(d.group); })
      .attr("y", function (d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.value); })
      .attr("fill", "rgb(133,8,8)")

   // rotate text on xAxis   
   xAxis
      .selectAll("text")	
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
         return "rotate(-45)" 
         });

   var dd1 = d3.select("#dd1").property('value')
   var dd2 = d3.select("#dd2").property('value')
   //add Chart Title
   update_svg
      .enter()
      .append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text('Top 10 Roblox Games by Category')

   // add X Axis Labels     
   update_svg
      .enter()
      .append("text")  
      .attr("x", (width/2))
      .attr("y", height + margin.top-50)
      .style("font-size", "16px")            
      .style("text-anchor", "middle")
      .text("Game Name");

   // add Y Axis Labels
   update_svg
      .enter()
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("font-size","16px")
      .style("text-anchor", "middle")
      .text("Selected Game Property"); 
   
      // If fewer groups in the new dataset, delete the ones not in use anymore
   update_svg
      .exit()
      .remove()
}

function buildCharts() {
   //connect to collect data from json
   d3.json(json_file).then(function (data) {
      // var game_cat_list=["Up-and-Coming", "Most Engaging", "Popular", "Top Rated"]
      var dd1 = d3.select("#dd1").property("value")
      var dd2 = d3.select("#dd2").property('value') // default value at pageload
      var category_filter = data.filter(sampleCategory => sampleCategory.game_data.game_category == dd1)

      var data_rating = []
      var data_no_players = []
      var data1 = {}
      var data2 = {}

      for (var i = 0; i < 10; i++) {
         data1 = { group: category_filter[i].game, value: parseInt(category_filter[i].game_data.user_count) }
         data2 = { group: category_filter[i].game, value: parseInt(category_filter[i].game_data.positive_ratings) }
         data_no_players.push(data1)
         data_rating.push(data2)

      }

      if (dd2=="No. Players") {
         update(data_no_players)
      }

      else {
         update(data_rating)
      }

      // assign label to rectange with title of game
      var xlabel=x.domain()
      var rects=svg.selectAll("rect")
         .attr("data-name", function(d,i) {return xlabel[i]})

      //On Click, changes the selected game box to dark grey
      rects.on("click", function(d, i){
         d3.select(this,(d,i))
            .attr("fill", 'rgb(61,59,59)')
            .attr("id", "selected_game")
      
      var selected_game=d3.select(this).attr("data-name")

      //remove extra groups no longer in use
      rects.exit().remove()

      update_bubbles(selected_game)

      })
      
   })// close d3 call


};//build charts end

function predict_button(title, description){
  






function init() {
​
   d3.json(json_file).then(data => {
      var game_name = data.game;
      //  var dd1 = d3.select("#dd1");
      var dd1 = d3.select("#dd1").property('value')
​
      buildCharts(dd1);
   });// close d3 call
}; //close init
​
​
// Creates/updates the plot for a given variable:
function update(data) {
   // Update the X axis
   x.domain(data.map(function (d) { return d.group; }))
   xAxis.call(d3.axisBottom(x))
​
   // Update the Y axis
   y.domain([0, d3.max(data, function (d) { return d.value })]);
   yAxis.transition().duration(1000).call(d3.axisLeft(y));
​
   // Create the update variable
   var update_svg = svg.selectAll("rect")
      .data(data)
​
   update_svg
      .enter()
      .append("rect") // Add a new rect for each new element
      .merge(update_svg) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr("x", function (d) { return x(d.group); })
      .attr("y", function (d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.value); })
      .attr("fill", "rgb(133,8,8)")
​
   // rotate text on xAxis   
   xAxis
      .selectAll("text")	
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
         return "rotate(-45)" 
         });
​
   var dd1 = d3.select("#dd1").property('value')
   var dd2 = d3.select("#dd2").property('value')
   //add Chart Title
   update_svg
      .enter()
      .append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text('Top 10 Roblox Games by Category')
​
   // add X Axis Labels     
   update_svg
      .enter()
      .append("text")  
      .attr("x", (width/2))
      .attr("y", height + margin.top-50)
      .style("font-size", "16px")            
      .style("text-anchor", "middle")
      .text("Game Name");
​
   // add Y Axis Labels
   update_svg
      .enter()
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("font-size","16px")
      .style("text-anchor", "middle")
      .text("Selected Game Property"); 
   
      // If fewer groups in the new dataset, delete the ones not in use anymore
   update_svg
      .exit()
      .remove()
}
​
function buildCharts() {
   //connect to collect data from json
   d3.json(json_file).then(function (data) {
      // var game_cat_list=["Up-and-Coming", "Most Engaging", "Popular", "Top Rated"]
      var dd1 = d3.select("#dd1").property("value")
      var dd2 = d3.select("#dd2").property('value') // default value at pageload
      var category_filter = data.filter(sampleCategory => sampleCategory.game_data.game_category == dd1)
​
      var data_rating = []
      var data_no_players = []
      var data1 = {}
      var data2 = {}
​
      for (var i = 0; i < 10; i++) {
         data1 = { group: category_filter[i].game, value: parseInt(category_filter[i].game_data.user_count) }
         data2 = { group: category_filter[i].game, value: parseInt(category_filter[i].game_data.positive_ratings) }
         data_no_players.push(data1)
         data_rating.push(data2)
​
      }
​
      if (dd2=="No. Players") {
         update(data_no_players)
      }
​
      else {
         update(data_rating)
      }
​
      // assign label to rectange with title of game
      var xlabel=x.domain()
      var rects=svg.selectAll("rect")
         .attr("data-name", function(d,i) {return xlabel[i]})
​
      //On Click, changes the selected game box to dark grey
      rects.on("click", function(d, i){
         d3.select(this,(d,i))
            .attr("fill", 'rgb(61,59,59)')
            .attr("id", "selected_game")
      
      var selected_game=d3.select(this).attr("data-name")
​
      //remove extra groups no longer in use
      rects.exit().remove()
​
      update_bubbles(selected_game)
​
      })
      
   })// close d3 call
​
​
};//build charts end
​
function update_bubbles(selected_game) {
   //connect to collect data from json
      d3.json(json_file).then(function (data) {
      var dd3 = d3.select("#dd3").property('value')
      var video_filter = data.filter(videos => videos.game==selected_game)
​
​
      var video_date_list=[]
      var video_views_list=[]
      var video_name_list=[]
      var video_url_list =[]
      var video_likes_list = []
      var video_comments_list=[]
      var game_name_list =[]
​
​
      for (var i = 0; i < 5; i++) {
        var video_name=video_filter[0].video_data[i].video_name;
        video_name_list.push(video_name)
        var video_views = video_filter[0].video_data[i].yt_views; 
        video_views_list.push(video_views/3500)
        var video_date = video_filter[0].video_data[i].pub_date;
        video_date_list.push(video_date)
        var video_url = video_filter[0].video_data[i].video_url;
        video_url_list.push(video_url)
        var video_likes = video_filter[0].video_data[i].yt_likes;
        video_likes_list.push(video_likes/100)
        var video_comments = video_filter[0].video_data[i].yt_comments;
        video_comments_list.push(video_comments/25) 
        var game_name = video_filter[0].game
        game_name_list.push(game_name)
      }//close for loop
​
         if (dd3=="Views"){
            var bubble_show =video_views_list
            
         }
         else if (dd3=="Likes"){
            var bubble_show=video_likes_list
         }
​
         else{
            var bubble_show=video_comments_list
         }
​
      var bubblesLayout = {
         'title': `You Tube Videos by ${dd3} for Selected Game: ${game_name}`,
         'margin': { t: 50, r: 30, l: 150, b: 50 },
         'hovermode': 'closest',
         'xaxis_type': 'date',
         'xaxis_title': 'Date',
         'yaxis_title': 'Game'
         
      };//close bubbles Layout
​
      var bubblesTrace = {
         'x': video_date_list,
         'y': game_name_list,
         'text': video_name_list,
         'sizemode': 'area',
         'mode': 'markers',
         'marker': {
            'size': bubble_show,
            'label': video_url_list,
            'color': bubble_show,
            'colorscale': 'Reds'
         },//ends marker
​
      }//closes Bubble Trace
​
      var data=bubblesTrace
​
      // Creating the plots
      Plotly.newPlot('bubble', [data], bubblesLayout);
      
      // Selects the bubble in the plot and gets the YouTube URL
      var myPlot=document.getElementById('bubble')
​
      myPlot.on('plotly_click', function(data){
         var pts = []
         var x = data.points[0].x;
​
         for(var i=0; i < 5; i++){
            if (x==data.points[0].data.x[i]) {
               pts=data.points[0].data.marker.label[i]
            }
             }
         // Appends the url and text information to the html element
         d3.select('#url').property('text', pts)     
         d3.select('#url').property('href', pts)
​
      });
​
   })// update plotly
}//closes bubble function
​
init();
 
​
​
Collapse



}














//herer





function update_bubbles(selected_game) {
   //connect to collect data from json
      d3.json(json_file).then(function (data) {
      var dd3 = d3.select("#dd3").property('value')
      var video_filter = data.filter(videos => videos.game==selected_game)


      var video_date_list=[]
      var video_views_list=[]
      var video_name_list=[]
      var video_url_list =[]
      var video_likes_list = []
      var video_comments_list=[]
      var game_name_list =[]


      for (var i = 0; i < 5; i++) {
        var video_name=video_filter[0].video_data[i].video_name;
        video_name_list.push(video_name)
        var video_views = video_filter[0].video_data[i].yt_views; 
        video_views_list.push(video_views/3500)
        var video_date = video_filter[0].video_data[i].pub_date;
        video_date_list.push(video_date)
        var video_url = video_filter[0].video_data[i].video_url;
        video_url_list.push(video_url)
        var video_likes = video_filter[0].video_data[i].yt_likes;
        video_likes_list.push(video_likes/100)
        var video_comments = video_filter[0].video_data[i].yt_comments;
        video_comments_list.push(video_comments/25) 
        var game_name = video_filter[0].game
        game_name_list.push(game_name)
      }//close for loop

         if (dd3=="Views"){
            var bubble_show =video_views_list
            
         }
         else if (dd3=="Likes"){
            var bubble_show=video_likes_list
         }

         else{
            var bubble_show=video_comments_list
         }

      var bubblesLayout = {
         'title': `You Tube Videos by ${dd3} for Selected Game: ${game_name}`,
         'margin': { t: 50, r: 30, l: 150, b: 50 },
         'hovermode': 'closest',
         'xaxis_type': 'date',
         'xaxis_title': 'Date',
         'yaxis_title': 'Game'
         
      };//close bubbles Layout

      var bubblesTrace = {
         'x': video_date_list,
         'y': game_name_list,
         'text': video_name_list,
         'sizemode': 'area',
         'mode': 'markers',
         'marker': {
            'size': bubble_show,
            'label': video_url_list,
            'color': bubble_show,
            'colorscale': 'Reds'
         },//ends marker

      }//closes Bubble Trace

      var data=bubblesTrace

      // Creating the plots
      Plotly.newPlot('bubble', [data], bubblesLayout);
      
      // Selects the bubble in the plot and gets the YouTube URL
      var myPlot=document.getElementById('bubble')

      myPlot.on('plotly_click', function(data){
         var pts = []
         var x = data.points[0].x;

         for(var i=0; i < 5; i++){
            if (x==data.points[0].data.x[i]) {
               pts=data.points[0].data.marker.label[i]
            }
             }
         // Appends the url and text information to the html element
         d3.select('#url').property('text', pts)     
         d3.select('#url').property('href', pts)

      });

   })// update plotly
}//closes bubble function

init();
 


