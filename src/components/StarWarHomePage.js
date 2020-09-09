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
        fetch('https://swapi.dev/api/people/')
            .then( response => response.json())
            .then( result => {
                if(result.next) {
                    this.dataFetchWithNextURL(result, 1);
                }
                else {
                    this.dataFetchVisitedPage(result, 1);
                }
            })
            .catch(err => console.log(err));
    }

    dataFetchVisitedPage = (result, pageClicked) => {
        this.setState( {
            people: result.results,
            nextURL: result.next,
            visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
        });
    }

    dataFetchWithNextURL = (result, pageClicked) => {
        //console.log('next URL is present');
        this.setState( (prevState) => {
            return {
                people: result.results,
                nextURL: result.next,
                noOfPages: prevState.noOfPages + 1,
                visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
            }
        });
    }

    fetchDataForVisitedPageAtLeastOnce = (pageClicked) => {
        const url = `http://swapi.dev/api/people/?page=${pageClicked}`;
        fetch(url)
            .then(response => response.json())
            .then( result => {
                this.dataFetchVisitedPage(result, pageClicked);
            })
    }

    fetchPeopleData = (pageClicked) => {
        //nextURL is present
        if(this.state.nextURL) {
            //unvisited pages   -visiting for the first time
            //this condition is required, when
            if(this.state.nextURL.includes(`page=${pageClicked}`)) {
                //console.log('next URL matched with the pageClick')
                fetch(this.state.nextURL)
                    .then(response => response.json())
                    .then(result => {
                        //next URL is present
                        if(result.next) {
                            this.dataFetchWithNextURL(result, pageClicked);
                        }
                        //next URL is not present
                        else {
                            //console.log('NEXT URL is NOT PRESENT');
                            this.dataFetchVisitedPage(result, pageClicked);
                        }
                    })
                    .catch(err => console.log(err));
            }
            else {
                //re-visiting the page more than once before checking all the pages
                //re-visiting the same page more than once
                //console.log('next url is present but not matching with the nextURL page number & pageClick');
                this.fetchDataForVisitedPageAtLeastOnce(pageClicked);
            }
        }
        //nextURL is null, on click of last page returns nextURL as null, so then this will executes
        else {
            console.log('nextURL is there but clicked on already visited page');
            this.fetchDataForVisitedPageAtLeastOnce(pageClicked);
        }
    }

    render() {
        console.log('visitedPages arr ', this.state.visitedPages);
        console.log(this.state.nextURL);
        const people = this.state.people;
        //console.log(people);
        //console.log(this.state.nextURL);
        return (
            <div>
                <PeopleTable people={people} nextURL={this.state.nextURL} noOfPages={this.state.noOfPages} fetchPeopleData={this.fetchPeopleData} />
            </div>
        );
    }
}

export default StarWarHomePage;