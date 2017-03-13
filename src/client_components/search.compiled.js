const Nav = React.createClass({
  displayName: "Nav",

  getInitialState: function () {
    return {
      searching: false
    };
  },
  submitQuery: function (event) {
    if (event.keyCode != 13) {} else {
      query = {
        query: $("#search").val()
      };
      console.log("YOUR QUERY", query);
      $.ajax({
        url: '/query',
        dataType: 'json',
        type: 'POST',
        data: query,
        success: function (data) {
          //this.setState({searching : false});
          $("#search").val(''); // clear the search query
          this.props.passResults(data, query.query);
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
      console.log("REACHED END");
      this.props.setLoad();
    }
  },
  render: function () {
    if (this.props.searching == false) {
      var search = React.createElement(
        "div",
        { className: "nav-wrapper" },
        React.createElement(
          "div",
          { className: "input-field" },
          React.createElement("input", { id: "search", type: "search", onKeyUp: this.submitQuery, required: true }),
          React.createElement(
            "label",
            { htmlFor: "search" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "search"
            )
          ),
          React.createElement(
            "i",
            { className: "material-icons" },
            "close"
          )
        )
      );
    } else {
      var search = React.createElement(
        "div",
        { className: "nav-wrapper" },
        React.createElement(
          "div",
          { className: "input-field" },
          React.createElement("input", { id: "search", type: "search", onKeyUp: this.submitQuery, required: true, disabled: true }),
          React.createElement(
            "label",
            { htmlFor: "search" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "search"
            )
          ),
          React.createElement(
            "i",
            { className: "material-icons" },
            "close"
          )
        ),
        React.createElement(
          "div",
          { className: "progress" },
          React.createElement("div", { className: "indeterminate" })
        )
      );
    }

    return React.createElement(
      "nav",
      null,
      search
    );
  }
});

const Info = React.createClass({
  displayName: "Info",

  render: function () {
    return React.createElement(
      "div",
      { className: "col s12 center" },
      React.createElement(
        "h1",
        null,
        "Welcome to the Hashtag Analysis tool!"
      ),
      React.createElement("br", null),
      React.createElement(
        "h5",
        null,
        "This tool seeks to analyze the sentiment, emotion, and obscenity of certain hashtag users across the United States.",
        React.createElement("br", null),
        "Search by a state or a hashtag to and just click on whatever result you want. The following table provides more information."
      ),
      React.createElement(
        "table",
        null,
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { className: "center", "data-field": "id" },
              "Color"
            ),
            React.createElement(
              "th",
              { className: "center", "data-field": "name" },
              "Field"
            ),
            React.createElement(
              "th",
              { className: "center", "data-field": "price" },
              "Description"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { className: "center" },
              "N/A"
            ),
            React.createElement(
              "td",
              { className: "center" },
              "Sentiment"
            ),
            React.createElement("td", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { className: "center" },
              "N/A"
            ),
            React.createElement(
              "td",
              { className: "center" },
              "Obscenity"
            ),
            React.createElement("td", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { className: "orange center white-text" },
              "Orange"
            ),
            React.createElement(
              "td",
              { className: "center" },
              "Joy"
            ),
            React.createElement("td", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { className: "black center white-text" },
              "Black"
            ),
            React.createElement(
              "td",
              { className: "center" },
              "Fear"
            ),
            React.createElement("td", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { className: "green center white-text" },
              "Green"
            ),
            React.createElement(
              "td",
              { className: "center" },
              "Disgust"
            ),
            React.createElement("td", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { className: "blue center white-text" },
              "Blue"
            ),
            React.createElement(
              "td",
              { className: "center" },
              "Sadness"
            ),
            React.createElement("td", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { className: "red center white-text" },
              "Red"
            ),
            React.createElement(
              "td",
              { className: "center" },
              "Anger"
            ),
            React.createElement("td", null)
          )
        )
      )
    );
  }
});

const Body = React.createClass({
  displayName: "Body",

  render: function () {
    if (this.props.init) {
      var markup = React.createElement(Info, null);
    } else if (jQuery.isEmptyObject(this.props.results)) {
      var markup = React.createElement(
        "ul",
        { className: "collapsible", "data-collapsible": "accordion" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: "collapsible-header center" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "search"
            ),
            React.createElement(
              "h1",
              null,
              "Search for a tweet!"
            )
          )
        )
      );
    } else if (this.props.results[0] == "") {
      var markup = React.createElement(
        "ul",
        { className: "collapsible", "data-collapsible": "accordion" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: "collapsible-header center" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "error"
            ),
            React.createElement(
              "h1",
              null,
              "No results found!"
            )
          )
        )
      );
    } else {
      var Results = [];
      for (var i = 0; i < this.props.results.length - 1; i++) {
        console.log('--------------------RESULT:' + this.props.results.length + '/' + (i + 1) + '--------------------');
        Results.push(ParseFullResults(this.props.results[i].substring(1, this.props.results[i].length).replace(/\n/g, " ")));
        console.log('~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~');
      }
      console.log(Results);
      var docNodes = Results.map(function (result, index) {
        var hashtags = result.hashtags.toString();
        return React.createElement(
          "li",
          { key: index },
          React.createElement(
            "div",
            { className: "collapsible-header" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "info"
            ),
            "Score: ",
            result.score,
            React.createElement("br", null),
            " Date: ",
            result.timestamp
          ),
          React.createElement(
            "div",
            { className: "collapsible-body" },
            React.createElement(
              "p",
              null,
              "Name: ",
              result.name,
              React.createElement("br", null),
              "Message: ",
              result.message,
              React.createElement("br", null),
              "Location: ",
              result.location,
              React.createElement("br", null),
              "hashtags: ",
              hashtags,
              React.createElement("br", null),
              "url-titles: ",
              result.url_titles
            )
          )
        );
      });
      var markup = React.createElement(
        "ul",
        { className: "collapsible", "data-collapsible": "accordion" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: "collapsible-header center" },
            "Search results for \"",
            this.props.query,
            "\""
          )
        ),
        docNodes
      );
    }
    return React.createElement(
      "div",
      { className: "container" },
      markup
    );
  }
});

const Container = React.createClass({
  displayName: "Container",

  getInitialState: function () {
    return {
      init: true,
      results: {},
      searching: false,
      query: "null"
    };
  },
  parseResults: function (results, query) {
    var docs = results.substring(results.indexOf("~STRT~") + 7, results.indexOf("~END~")).split("}\n");
    this.setState({ results: docs, searching: false, query: query });
  },
  loader: function () {
    if (this.state.searching == true) this.setState({ searching: false });else this.setState({ searching: true });
  },
  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(Nav, { setLoad: this.loader, passResults: this.parseResults, searching: this.state.searching }),
      React.createElement("br", null),
      React.createElement(Body, { init: this.state.init, query: this.state.query, results: this.state.results, searching: this.state.searching })
    );
  }
});

ReactDOM.render(React.createElement(Container, null), document.getElementById('markup'));
