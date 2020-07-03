import React from 'react';
import _ from 'lodash';
const cc = require('cryptocompare')

cc.setApiKey('c2178e9b74cd347a651382cbf818289712d013f12b3b43ec6903187655719cbf')

export const AppContext = React.createContext();

const Max_FAVORITES = 10;

export class AppProvider extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            page: 'dashboard',
            favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
            ...this.savedSettings(),
            setPage: this.setPage,
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            isInFavorites: this.isInFavorites,
            confirmFavorites: this.confirmFavorites,
            setFilteredCoins: this.setFilteredCoins
    }
}

componentDidMount = () =>{
    this.fetchcoins();
    this.fetchPrices();
}

fetchcoins = async () =>{
    let coinList = (await cc.coinList()).Data;
    this.setState({coinList});
}

fetchPrices = async () => {
    if(this.state.firstVisit) return;
    let prices = await this.prices();
    prices = prices.filter(price => Object.keys(price).length);
    this.setState({prices});
  }


addCoin = key =>{
    let favorites = [...this.state.favorites]
    if(favorites.length < Max_FAVORITES){
        favorites.push(key);
        this.setState({favorites});
    }
}

removeCoin = key => {
    let favorites = [...this.state.favorites]
    this.setState({favorites: _.pull(favorites, key)});
}

isInFavorites = key => {
    _.includes(this.state.favorites, key)
}

setFilteredCoins = (filteredCoins) => this.setState({filteredCoins})

confirmFavorites = () => {
    this.setState({
        firstVisit: false,
        page: 'dashboard'
    });
    localStorage.setItem('cryptoDash', JSON.stringify({ favorites: this.state.favorites}));
}

savedSettings(){
    let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
    if(!cryptoDashData){
        return { page: 'settings', firstVisit: true}
    }
    let {favorites, currentFavorite} = cryptoDashData;
    return {favorites, currentFavorite};
}   


setPage = page => this.setState({page})

render(){
    return(
        <AppContext.Provider value={this.state}>
            {this.props.children}
        </AppContext.Provider>
    )
}
}