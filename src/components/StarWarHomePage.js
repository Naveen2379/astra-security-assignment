import React, {Component} from 'react';
import PeopleTable from "./PeopleTable";
import {faExclamationCircle, faExclamationTriangle, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {isEmpty} from "lodash";

class StarWarHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            nextURL: '',
            noOfPages: 1,
            visitedPages: [],
            loading: false,
            errorOccured: false
        }
    }

    componentDidMount() {
        this.fetchDataForFirstPage();
    }

    fetchDataForFirstPage = () => {
        //fetch('https://swapi.dev/api/people/')
        fetch('http://swapi.dev/api/people/?page=10')
            .then( response => response.json())
            .then( result => {
                if(result.next) {
                    this.dataFetchWithNextURL(result, 1);
                }
                else {
                    this.dataFetchWithOutNextURL(result, 1);
                }
            })
            .catch(err => {
                console.log(err);
             this.setState({
                 errorOccured: true
             })
            });
    }

    fetchURLsFromSpecies = (peopleResult) => {
        const peopleWithSpecies = peopleResult.results.map( (eachObj) => {
            if(eachObj.species[0] !== undefined) {
                return eachObj.species[0];
            }
            return null;
        });
        const extractedURLs = peopleWithSpecies.filter( (url) => url!=null);
        console.log('fetchURLsFromSpecies function');
        console.log(peopleResult);
        console.log(extractedURLs);
        let finalPeopleResult = [];
        const finalResultPromise = Promise.all( extractedURLs.map((url)=>fetch(url)))
            .then( responses => Promise.all(responses.map( (response) => response.json())))
            .then( results => {
                console.log(results);
                finalPeopleResult = peopleResult.results.map( (eachObj) => {
                    let replaceInd = 0;
                    if (eachObj.species[0]) {
                        eachObj = {...eachObj, ['species']: results[replaceInd].name};
                        replaceInd++;
                    }
                    else {
                        eachObj = {...eachObj, ['species']: null}
                    }
                    return eachObj;
                })
                console.log(finalPeopleResult);
                return finalPeopleResult;
            })
            return finalResultPromise;
    }

    dataFetchWithNextURL = (peopleResult, pageClicked) => {
        //console.log('next URL is present');
        this.fetchURLsFromSpecies(peopleResult)
            .then(finalPeopleResult => {
                return this.setState( (prevState) => {
                 return {
                     people: finalPeopleResult,
                     nextURL: peopleResult.next,
                     noOfPages: prevState.noOfPages + 1,
                     visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                 }
             })
            })
    }

    dataFetchWithOutNextURL = (peopleResult, pageClicked) => {
        this.fetchURLsFromSpecies(peopleResult)
            .then(finalPeopleResult => {
                this.setState({
                    people: finalPeopleResult.results,
                    nextURL: peopleResult.next,
                    visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                });
            })
    }

    fetchDataForVisitedPage = (pageClicked) => {
        const url = `http://swapi.dev/api/people/?page=${pageClicked}`;
        fetch(url)
            .then(response => response.json())
            .then( peopleResult => {
                this.fetchURLsFromSpecies(peopleResult)
                    .then(finalPeopleResult => {
                        console.log(finalPeopleResult);
                        this.setState({
                            people: finalPeopleResult,
                            visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                        });
                    })
            })
    }

    fetchPeopleData = (pageClicked) => {
            if(this.state.visitedPages.includes(pageClicked) ) {
                //nextURL is null, on click of last page returns nextURL as null, so then this will executes
                this.fetchDataForVisitedPage(pageClicked);
            }
            else {
                fetch(this.state.nextURL)
                    .then(response => response.json())
                    .then(result => {
                        //next URL is present
                        console.log(result);
                        if(result.next) {
                            this.dataFetchWithNextURL(result, pageClicked);
                        }
                        //next URL is null
                        else {
                            this.dataFetchWithOutNextURL(result, pageClicked);
                        }
                    })
                    .catch(err => console.log(err));
            }
    }

    fetchOnSearchName = (name) => {
            if(name) {
                this.setState({
                    loading: true
                }, () => {
                    fetch(`https://swapi.dev/api/people/?search=${name}`)
                        .then(response => response.json())
                        .then(result => this.setState({
                            loading: false,
                            people: result.results,
                            noOfPages: 1,
                            nextURL: '',
                            visitedPages: []
                        }));
                })
            }
            else {
                this.fetchDataForFirstPage();
            }
    }



    render() {
        console.log('visitedPages arr ', this.state.visitedPages);
        const {people, errorOccured} = this.state;
        console.log(people);
        return (
            <div>
                {
                    errorOccured ? <FontAwesomeIcon icon={faExclamationCircle} size="6x" /> :
                        <PeopleTable people={people}
                                     loading={this.state.loading}
                                     noOfPages={this.state.noOfPages}
                                     fetchPeopleData = {this.fetchPeopleData}
                                     fetchOnSearchName={this.fetchOnSearchName}
                        />
                }
            </div>
        );
    }
}

export default StarWarHomePage;