# Roblox-Project

Project 2 Outline
For the ETL project, our group focused on creating a service to combine information about Roblox games that gamers would be interested in trying out based and video tutorials for those games from Youtube.

Leveraging our access to the correct data (both in the Roblox web scrape and the Youtube API), we plan on expanding and enhancing this service to provide end users with a better visual representation of the Roblox games (who is playing them at the current time and comparing multiple games in the same larger category) and showing metrics on the youtube tutorial videos.

Final product
We will create a unique service (housed in an html) allowing end users the ability to leverage our Roblox database and Youtube database to view the best Roblox game, filtered by category and key metrics, and see the Youtube tutorial results associated with those titles.

On our service, we will create 3 different visualizations to help inform the end user about the games. Our first and key visual is the interactive bar chart displaying the title of the top games based on the game category. Users will be able to search top games by category provided by the Roblox webscrape. Customers will be able to select from the list of key attributes to further filter the top results. This will expand the use of our service by allowing end users to filter the game titles by 2 different metrics.
Another useful relationship that users might appreciate is to see how the various game titles correspond with the various categories. We will use a Sankey Diagram to show if game titles appear in multiple categories. This visual will show the end user if the game title they’re interested in playing lands within the top results for multiple categories. For example, if a game is found in both the most engaging and most popular categories, users will be able to tell that the game is popular and perhaps why.

Finally, we will create an interactive bubble chart for the top Youtube results based on the game selected. Much like when selecting a game title, providing end users with the ability to further refine the Youtube search results by various metrics will allow them to find the video that best suits their needs.
Project steps
Step 1
Review and update existing Roblox web scrape and Youtube API call to expand our database.

For the ELT project, our group scraped the Roblox website and called the Youtube API to gather data points on the various Roblox games and tutorial videos. These initial web scrape and API call did successfully provide us with the data needed in this project, but in a more limited scope. 

Leveraging these, we will significantly reduce our time working on  gathering the correct data. With this time saving in mind, we will expand our initial query to gather more game results for each category as well as additional categories. Expanding our results will only increase the value of our service.
Step 2
Leverage existing databases to return user search results.

As part of our ELT project efforts, we created 2 databases to store the results of our web scrape and API call. These databases already had an existing schema outlining the relationship between the two so pulling results will be relatively straightforward.

With an increased scope, we will re-examine this database schema to ensure this still works properly for our new service.
Step 3 
Create a html landing page for our service to live on.

This is where the heavy lifting of the project begins. We want to create an interactive website where users can filter video game results based on multiple criteria as well as see the top Youtube tutorial videos filtered by their desired criteria. To get this done, we create the outline landing page for which this service will live on.
Step 4
Create a connection to our databases to display results of user queries on the website.

With our landing page setup, we will create a python app to bring our user’s filtered results to the landing page. We will create a jsonify’d version of the data and display query results on our website. To get the query results, we will need to consume the user’s desired search criteria, create filters to refine the general query and display the results on our web page.
Step 5
Develop visualizations showing results with user-selected metrics.

Finally, we will create unique and interactive visuals to show the search results to the user. Rather than throwing a bunch of numbers for each game, providing a visualization to show the desired results to the users.

Project Visualizations
As part of this project, we are creating 3 unique visualizations to help users understand the games and videos better.

The key aspect of this project centers around how we visualize the relationship between a game title and the user’s desired metrics. We want to show the top results of game titles found in a particular category and sort the results based on various filters. One of the best visuals showing multiple results and ranking them based on filters is an interactive bar graph. This will show the user which game titles fit in the selected category while allowing them to compare the games to each other based on their preferences.

The second visualization we want to provide users is one surrounding the Youtube tutorial we are linking out to. As part of the API call, we gathered metrics around the videos (number of likes, overall approval rating, number of views, etc) which can be useful to users when selecting a tutorial video. As part of our service, we will create an interactive visual so the customer can see their desired metric about the videos. Rather than displaying 2 bar graph visuals, we will use a bubble chart visualization to show the top tutorial videos according to the user’s selected filter. Although this might not be as straightforward as the bar graph for the game results, this will still allow the user to compare the videos to determine which is the best for them.

Lastly, we will create a Sankey Diagram to show the relationship between game titles and the various game categories. A sankey diagram is typically used to examine the flow of a variable from one end to another, such as energy supply to energy demand. For our purposes, we will use this diagram to show how a game title flows into game categories. If a game title is a result in multiple categories, this diagram will show the user all the categories a particular game fits in. This relationship might not be the most essential to the user, but by showing how each title fits within the available game categories, the user will gain an added appreciation of how the game is viewed by Roblox gamers.
  
Sankey Diagram - examine the relationship between the game titles and the categories
https://observablehq.com/@d3/sankey-diagram

Bubble Chart - Youtube API data
https://observablehq.com/@d3/bubble-chart

Bar Chart - interactive chart for games in category
https://observablehq.com/@d3/sortable-bar-chart

Project Challenges
Enhancing and rendering our data
Our first and largest challenge we faced as part of this project was adding our data to our website. Leveraging our previous project helped cut down on our time gathering the relevant data, but cost us when trying to render the data on our website. 

The first challenge came from the original build of the web scrape. Although we were able to successfully scrape the Roblox website for our previous project, the scope was limited to games in one category. In order to expand our scope and include more game categories, we updated our web scrape code to pull game information from multiple pages. We leveraged the “click” functionality to grab information from each unique page. We also incorporated an additional value for each game of “game category”.

Once we had our web scrape database in a good state, we focused on rendering the data onto our webpage. This was one of the most difficult challenges as our data could not be jsonified and we didn’t know why. In truly classic fashion, after extensive troubleshooting we found that our data needed to be transformed from lists into dictionaries. This small update allows us to jsonify our data and render it without a hitch.
Creating interactive visualizations
In our original concept of the service, we wanted to create interactive visualizations to make them more user-friendly. With each game having multiple metrics associated with the game title, users would benefit from being able to see the top games in a category based on their chosen metric. In order to create this, we will need to create a function to update the visual to reflect the results based on the user’s filter. Although we have seen examples of this and even attempted it in previous homeworks, this is no small feat.

It took a lot of discipline and time to create the initial bar graph visualization. After a bit of troubleshooting, we were able to isolate the axis information and store the game name to be accessible with clicking on a rectangle in the D3 bar chart.  After clicking on the rectangle, the game name is stored as the active game, which feeds into code for populating the interactive bubble chart.  The bubble chart also includes functionality that allows the user to interact and select specific parameters for the chart, making it interactive. One of the biggest challenges with the bubble chart was figuring out how to isolate portions of plotly charts to derive the associated URL for the YouTube video. Isolating the bubbles in D3 likely would have been more straightforward.  Built-in functionality for plotly includes the ability to call out an alert box, but that does not allow the user to click directly on the URL. We were able to isolate the appropriate tag in plotly and use that information to populate another box outside of the chart, creating a clickable URL that brings the user directly to the selected video.

We also set the challenge of attempting a sankey diagram, a visualization we never worked on in class. This came with many pitfalls as we attempted to create the visualization. It’s more difficult to attempt a visual you are unfamiliar than expected.
