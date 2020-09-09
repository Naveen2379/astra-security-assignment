import React, {Component} from 'react';
import PeopleTable from "./PeopleTable";

class StarWarHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            nextURL: '',
            noOfPages: 1,
            visitedPages: []
        }
    }

    componentDidMount() {
        this.fetchDataForFirstPage();
    }

    fetchDataForFirstPage = () => {
        fetch('https://swapi.dev/api/people/')
            .then( response => response.json())
            .then( result => {
                if(result.next) {
                    this.dataFetchWithNextURL(result, 1);
                }
                else {
                    this.dataFetchWithOutNextURL(result, 1);
                }
            })
            .catch(err => console.log(err));
    }

    dataFetchWithNextURL = (peopleResult, pageClicked) => {
        //console.log('next URL is present');
        console.log('dataFetchWithNextURL');
        console.log(peopleResult);
        const peopleWithSpecies = peopleResult.results.map( (eachObj) => {
            if(eachObj.species[0] !== undefined) {
                return eachObj.species[0];
            }
            return null;
        });
        const urls = peopleWithSpecies.filter( (url) => url!=null);

        let finalPeople = [];
        Promise.all( urls.map((url)=>fetch(url)))
            .then( responses => Promise.all(responses.map( (response) => response.json())))
            .then( results => {
                finalPeople = peopleResult.results.map( (eachObj) => {
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
                console.log(finalPeople);
                this.setState( (prevState) => {
                    return {
                        people: finalPeople,
                        nextURL: peopleResult.next,
                        noOfPages: prevState.noOfPages + 1,
                        visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                    }
                });
            })
    }

    dataFetchWithOutNextURL = (result, pageClicked) => {
        this.setState( {
            people: result.results,
            nextURL: result.next,
            visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
        });
    }

    fetchDataForVisitedPage = (pageClicked) => {
        console.log('show first page');
        const url = `http://swapi.dev/api/people/?page=${pageClicked}`;
        fetch(url)
            .then(response => response.json())
            .then( result => {
                this.setState( {
                    people: result.results,
                    visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                });
            })
    }

    fetchPeopleData = (pageClicked) => {
        console.log(pageClicked);
            if(this.state.visitedPages.includes(pageClicked) ) {
                //nextURL is null, on click of last page returns nextURL as null, so then this will executes
                console.log('nextURL is there but clicked on already visited page');
                this.fetchDataForVisitedPage(pageClicked);
            }
            else {
                console.log('else');
                console.log(this.state.nextURL);
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
            fetch(`https://swapi.dev/api/people/?search=${name}`)
                .then(response => response.json())
                .then(result => this.setState({
                    people: result.results,
                    noOfPages: 1,
                    nextURL: '',
                    visitedPages: []
                }));
        }
        else {
            this.fetchDataForFirstPage();
        }
    }


    render() {
        console.log('visitedPages arr ', this.state.visitedPages);
        //console.log(this.state.nextURL);
        const people = this.state.people;
        console.log(people);
        //console.log(this.state.nextURL);
        return (
            <div>
                <PeopleTable people={people}
                             noOfPages={this.state.noOfPages}
                             fetchPeopleData = {this.fetchPeopleData}
                             fetchOnSearchName={this.fetchOnSearchName} />
            </div>
        );
    }
}

export default StarWarHomePage;