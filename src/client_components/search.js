const Nav = React.createClass({
  getInitialState : function() {
    return {
      searching : false
    }
  },
  submitQuery : function (event) {
    if(event.keyCode != 13) {

    } else {
      query = {
        query : $("#search").val()
      }
      console.log("YOUR QUERY", query);
      $.ajax({
         url: '/query',
         dataType: 'json',
         type: 'POST',
         data: query,
         success: function(data) {
           //this.setState({searching : false});
           $("#search").val('') // clear the search query
           this.props.passResults(data, query.query);
         }.bind(this),
         error: function(xhr, status, err) {
           console.error(this.props.url, status, err.toString());
         }.bind(this)
      });
      console.log("REACHED END");
      this.props.setLoad();
    }
  },
  render : function () {
    if(this.props.searching == false) {
      var search = (
          <div className="nav-wrapper">
            <div className="input-field">
              <input id="search" type="search" onKeyUp={this.submitQuery} required/>
              <label htmlFor="search"><i className="material-icons">search</i></label>
              <i className="material-icons">close</i>
            </div>
          </div>
      );
    }
    else {
      var search = (
          <div className="nav-wrapper">
            <div className="input-field">
              <input id="search" type="search" onKeyUp={this.submitQuery} required disabled/>
              <label htmlFor="search"><i className="material-icons">search</i></label>
              <i className="material-icons">close</i>
            </div>
            <div className="progress"><div className="indeterminate"></div></div>
          </div>
      );
    }

    return (
      <nav>
        {search}
      </nav>
    );
  }
});

const Info = React.createClass({
    render : function() {
      return (
        <div className="col s12 center">
          <h1>Welcome to the Hashtag Analysis tool!</h1>
          <br></br>
          <h5>
            This tool seeks to analyze the sentiment, emotion, and obscenity of certain hashtag users across the United States.
            <br></br>
            Search by a state or a hashtag to and just click on whatever result you want. The following table provides more information.
          </h5>
          <table>
            <thead>
              <tr>
                  <th className="center" data-field="id">Color</th>
                  <th className="center" data-field="name">Field</th>
                  <th className="center" data-field="price">Description</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="center">N/A</td>
                <td className="center">Sentiment</td>
                <td></td>
              </tr>
              <tr>
                <td className="center">N/A</td>
                <td className="center">Obscenity</td>
                <td></td>
              </tr>
              <tr>
                <td className="orange center white-text">Orange</td>
                <td className="center">Joy</td>
                <td></td>
              </tr>
              <tr>
                <td className="black center white-text">Black</td>
                <td className="center">Fear</td>
                <td></td>
              </tr>
              <tr>
                <td className="green center white-text">Green</td>
                <td className="center">Disgust</td>
                <td></td>
              </tr>
              <tr>
                <td className="blue center white-text">Blue</td>
                <td className="center">Sadness</td>
                <td></td>
              </tr>
              <tr>
                <td className="red center white-text">Red</td>
                <td className="center">Anger</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
});

const Body = React.createClass({
  render : function () {
    if(this.props.init) {
      var markup = <Info />
    }
    else if(jQuery.isEmptyObject(this.props.results)) {
      var markup = (
        <ul className="collapsible" data-collapsible="accordion">
        <li>
         <div className="collapsible-header center"><i className="material-icons">search</i><h1>Search for a tweet!</h1></div>
        </li>
        </ul>
      )
    }
    else if(this.props.results[0] == "")  {
      var markup = (
        <ul className="collapsible" data-collapsible="accordion">
        <li>
         <div className="collapsible-header center"><i className="material-icons">error</i><h1>No results found!</h1></div>
        </li>
        </ul>
      )
    }
    else {
      var Results = []
      for(var i = 0; i < this.props.results.length - 1; i++) {
        console.log('--------------------RESULT:' + this.props.results.length + '/' + (i + 1) + '--------------------');
        Results.push(ParseFullResults(this.props.results[i].substring(1, this.props.results[i].length).replace(/\n/g, " ")));
        console.log('~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~');
      }
      console.log(Results);
      var docNodes = Results.map(function(result, index) {
        var hashtags = result.hashtags.toString();
        return (
          <li key={index}>
           <div className="collapsible-header"><i className="material-icons">info</i>Score: {result.score}<br /> Date: {result.timestamp}</div>
           <div className="collapsible-body">
            <p>Name: {result.name}<br />
               Message: {result.message}<br />
               Location: {result.location}<br />
               hashtags: {hashtags}<br />
               url-titles: {result.url_titles}
            </p>
              </div>
          </li>
        )
      });
      var markup = (
          <ul className="collapsible" data-collapsible="accordion">
          <li>
           <div className="collapsible-header center">Search results for "{this.props.query}"</div>
          </li>
          {docNodes}
          </ul>
      )
    }
    return (
      <div className="container">
        {markup}
      </div>
    );
  }
});

const Container = React.createClass({
  getInitialState : function () {
    return {
      init : true,
      results : {},
      searching : false,
      query : "null"
    }
  },
  parseResults : function (results, query) {
    var docs = results.substring(results.indexOf("~STRT~") + 7, results.indexOf("~END~")).split("}\n");
    this.setState({results : docs, searching : false, query : query});
  },
  loader : function() {
    if(this.state.searching == true)
      this.setState({searching : false})
    else
      this.setState({searching : true})
  },
  render : function () {
    return (
      <div>
      <Nav setLoad={this.loader} passResults={this.parseResults} searching={this.state.searching} />
      <br />
      <Body init={this.state.init} query={this.state.query} results={this.state.results} searching={this.state.searching}/>
      </div>
    );
  }
});


ReactDOM.render(<Container />, document.getElementById('markup'));
