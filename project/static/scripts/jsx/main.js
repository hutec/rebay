/**
 * Created by robin on 14.12.16.
 */

import {HotKeys} from 'react-hotkeys';
import * as React from "react";

const map = {
    "ctrlEnter": "ctrl+enter",
    "ctrlDown": "ctrl+down",
    "h": "h"
};


const itemHandler = {
    'h': (event) => alert("Pressed h")
}


var getDuration = function(isoDuration) {
    var duration = moment.duration(isoDuration);
    var days = duration.days();
    var hours = duration.hours();
    var minutes = duration.minutes();

    return String(days) + "T " + String(hours) + "h " + String(minutes) + "min";
};

class EbayFavorites extends React.Component {
    /**
     *
     **/
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
            <div className="control">
                <p className="control">
                    <input
                        type="text"
                        id="brandSearch"
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
            <div className="control">
                <p className="control">
                    <input
                        type="text"
                        placeholder="Price Filter"
                        value={this.props.filterValue}
                        ref={(input) => this.filterValueInput = input}
                        onChange={this.handleChange}
                    />
                </p>
            </div>
        )
    }
}


class EbayItems extends React.Component {
    gridEbayElements() {
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
                <div className="column is-2 is-mobile">
                    <HotKeys keyMap={map} handlers={itemHandler}>
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
                                    <small>{item.title}</small>
                                    <hr />
                                    <b>{item.sellingStatus.convertedCurrentPrice.value} €</b>
                                    <br/>
                                    <small>{getDuration(item.sellingStatus.timeLeft)}</small>
                                </div>
                            </div>
                        </div>
                    </HotKeys>
                </div>
            )
        });
    }

    gridKKElements() {
        var priceFilter = this.props.priceFilter;

        return this.props.searchResults.map(function(item) {
            if (item.price > priceFilter) {
                return
            }

            if (item.pictureURLLarge) {
                var imageElement = React.createElement("img", {src: item.pictureURLLarge});
            } else if(item.galleryPlusPictureURL) {
                var imageElement = React.createElement("img", {src: item.galleryPlusPictureURL});
            } else {
                var imageElement = React.createElement("img", {src: item.galleryURL});
            }

            return(
                <div className="column is-2 is-mobile">
                    <HotKeys keyMap={map} handlers={itemHandler}>
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
                                    <small>{item.description}</small>
                                    <hr />
                                    <b>{item.price} €</b>
                                </div>
                            </div>
                        </div>
                    </HotKeys>
                </div>
            )
        });

    }

    render() {
        var elements;
        if (this.props.mode == "ebay") {
            elements = this.gridEbayElements();
        } else if(this.props.mode == "kleiderkreisel") {
            elements = this.gridKKElements();
        }

        return (
            <div className="columns is-multiline" id="ebay-grid">
                    {elements}
            </div>
        )
    }
}



class EbayApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "ebay",
            searchKeywords: '',
            searchResults: [],
            searchFavorites: [],
            priceFilter: 10000.0,
            listPosition: 0,
        };

        this.keyEventHandler = {
            'ctrl+enter': (event) => document.getElementById('brandSearch').focus(),
            'ctrl+up': (event) => this.changeListPosition(-1),
            'ctrl+down': (event) => this.changeListPosition(1),
            'ctrl+m': (event) => this.switchMode()
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handlePriceFilter = this.handlePriceFilter.bind(this);
        this.changeListPosition = this.changeListPosition.bind(this);
    }

    changeListPosition(change) {
        this.state.listPosition += change;
        this.state.listPosition = Math.max(0, this.state.listPosition)
        var activeSearch = this.state.searchFavorites[this.state.listPosition];
        this.handleUserInput(activeSearch.QueryKeywords);
    }

    switchMode() {
        if (this.state.mode == "ebay") {
            this.setState({
                "mode": "kleiderkreisel"
            })
        } else {
            this.setState({
                "mode": "ebay"
            })
        }
    }

    handleUserInput(keywords) {
        var index = this.state.listPosition;
        // Keep list position during user search
        for(var i = 0, len = this.state.searchFavorites.length; i < len; i++) {
            if(this.state.searchFavorites[i].QueryKeywords === keywords) {
                index = i;
                break;
            }
        }

        this.setState({
            searchKeywords: keywords,
            listPosition: index,
            searchResults: []
        });

        window.scrollTo(0, 0);

        var endpoint;
        if (this.state.mode == "ebay") {
            endpoint = "/ebay/search"
        } else if (this.state.mode == "kleiderkreisel") {
            endpoint = "/kk/search"
        }

        $.get({
            url: endpoint,
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
           <HotKeys handlers={this.keyEventHandler}>
               <div className="container" id="title-container" >
                   <h1 className="title">{this.state.searchKeywords} - {this.state.mode}</h1>
                   <hr />
               </div>
               <div className="columns is-mobile">
                   <aside className="column menu is-2 aside is-fullheight is-hidden-mobile" id="side-menu">
                       <div>
                           <EbayFavorites
                               searchFavorites={this.state.searchFavorites}
                               onUserInput={this.handleUserInput}
                           />
                       </div>
                   </aside>

                   <div className="column is-10">
                       <div className="control is-horizontal" id="control-container">
                           <label className="control-label">Brand</label>
                           <BrandSearch
                               onUserInput={this.handleUserInput} />

                           <label className="control-label">Price</label>
                           <PriceFilterBar
                               onFilterChange={this.handlePriceFilter}
                           />
                       </div>


                       <EbayItems
                           priceFilter={this.state.priceFilter}
                           searchResults={this.state.searchResults}
                           searchKeywords={this.state.searchKeywords}
                           mode={this.state.mode}

                       />
                   </div>
               </div>
           </HotKeys>
       )
   }
};

ReactDOM.render(
    <EbayApp />,
    document.getElementById('ebay-app')
);
