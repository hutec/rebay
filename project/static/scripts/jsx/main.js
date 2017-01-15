/**
 * Created by robin on 14.12.16.
 */

var getDuration = function(isoDuration) {
    var duration = moment.duration(isoDuration);
    var days = duration.days();
    var hours = duration.hours();
    var minutes = duration.minutes();

    return String(days) + "T " + String(hours) + "h " + String(minutes) + "min";
};

class EbayFavorites extends React.Component {
    handleClick(keywords) {
        this.props.onUserInput(keywords);
    }

    render() {
        return (
            <div>
                <ul className="menu-list">
                    { this.props.searchFavorites.map(function(search){ return <li><a onClick={this.handleClick.bind(this, search.QueryKeywords)}>{search.QueryKeywords}</a></li>}, this) }
                </ul>
            </div>
        )
    }
}


class BrandSearch extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.props.onUserInput(this.keywords.value);
    }

    render() {
        return (
            <div className="control is-grouped">
                <p className="control">
                    <input
                        type="text"
                        placeholder="Brand search..."
                        ref={(input) => this.keywords = input}
                    />
                </p>
                <p className="control">
                    <button className="button is-primary" onClick={this.handleChange}>Search</button>
                </p>
            </div>
        )
    }
}

class PriceFilterBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.props.onFilterChange(this.filterValueInput.value);
    }

    render() {
        return (
            <p className="control">
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterValue}
                    ref={(input) => this.filterValueInput = input}
                    onChange={this.handleChange}
                />
            </p>
        )
    }
}


class EbaySearch extends React.Component {
    gridElements() {
        var priceFilter = this.props.priceFilter;

        return this.props.searchResults.map(function(item) {
            if (parseFloat(item.sellingStatus.convertedCurrentPrice.value) > priceFilter) {
                return;
            }

            if (item.pictureURLLarge) {
                var imageElement = React.createElement("img", {src: item.pictureURLLarge});
            } else if(item.galleryPlusPictureURL) {
                var imageElement = React.createElement("img", {src: item.galleryPlusPictureURL});
            } else {
                var imageElement = React.createElement("img", {src: item.galleryURL});
            }

            return(
                <div className="column is-3">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image">
                                <a href={item.viewItemURL}>
                                    {imageElement}
                                </a>
                            </figure>
                        </div>
                        <div className="card-content">
                            <div className="content">
                                {item.title}
                                <br/>
                                    <small>{item.sellingStatus.convertedCurrentPrice.value} €</small>
                                <br/>
                                    <small>{getDuration(item.sellingStatus.timeLeft)}</small>
                            </div>
                        </div>
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <div className="columns is-multiline" id="ebay-grid">
                {this.gridElements()}
            </div>
        )
    }
}



class EbayApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKeywords: 'Test',
            searchResults: [],
            searchFavorites: [],
            priceFilter: 400.0
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handlePriceFilter = this.handlePriceFilter.bind(this);
    }

    handleUserInput(keywords) {
        this.setState({
            searchKeywords: keywords
        });

        $.get({
            url: "/ebay/search",
            data: {
                keywords: keywords
            },
            success: function(data) {
                this.setState({
                    searchResults: data['searchResult']['item']});
            }.bind(this)
        });
    }

    handlePriceFilter(filterValue) {
        this.setState({
            priceFilter: filterValue
        });
    }


    componentDidMount() {
        $.get({
            url: "/ebay/favorites",
            success: function(data) {
                this.setState({
                    searchFavorites: data['FavoriteSearches']['FavoriteSearch']});
            }.bind(this)
        });
    }

    render() {
       return (
           <div className="columns is-mobile">
               <div className="column">
                   <aside className="menu">
                       <p className="menu-label">
                           Favorite Searches
                       </p>
                       <BrandSearch
                           onUserInput={this.handleUserInput} />
                       <EbayFavorites
                           searchFavorites={this.state.searchFavorites}
                           onUserInput={this.handleUserInput}
                       />
                   </aside>
               </div>
               <div class="column">
                   {/*<PriceFilterBar
                        onFilterChange={this.handlePriceFilter}
                   />*/}
                   <EbaySearch
                       priceFilter={this.state.priceFilter}
                       searchResults={this.state.searchResults}
                       searchKeywords={this.state.searchKeywords}
                   />
               </div>
           </div>
       )
   }
};

ReactDOM.render(
    <EbayApp/>,
    document.getElementById('ebay-app')
);
