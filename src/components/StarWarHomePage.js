import React, {Component} from 'react';
import PeopleTable from "./PeopleTable";

class StarWarHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            people: []
        }
    }

    componentDidMount() {
        const promise1 = fetch('https://swapi.dev/api/people/');
        const promise2 = fetch('https://swapi.dev/api/people/?page=2')
        const promise3 = fetch('https://swapi.dev/api/people/?page=3');

        Promise.all( [promise1, promise2, promise3])
            .then( responses => Promise.all(responses.map( (response) => response.json())))
            .then( results => results.map( res => res.results).flat())
            .then( peopleResults => this.setState({
                people: peopleResults})
            )
    }

    render() {
        const people = this.state.people;
        return (
            <div>
                <PeopleTable people={people} />
            </div>
        );
    }
}

export default StarWarHomePage;