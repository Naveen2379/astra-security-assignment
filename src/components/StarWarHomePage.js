import React, {Component} from 'react';
import PeopleTable from "./PeopleTable";
import {faExclamationCircle, faExclamationTriangle, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {isEmpty} from "lodash";
import {Button, Col, Input, Row} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import '../styles/StarWarHomePage.css';


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
            .catch(err => {
                console.log(err);
                this.setState({
                    errorOccured: true
                });
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
        let finalPeopleResult = [];
        let finalResultPromise;
        finalResultPromise = Promise.all( extractedURLs.map((url)=>fetch(url)))
            .then( responses => Promise.all(responses.map( (response) => response.json())))
            .then( results => {
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
                return finalPeopleResult;
            })
            return finalResultPromise;
    }

    dataFetchWithNextURL = (peopleResult, pageClicked) => {
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
                        this.setState({
                            people: finalPeopleResult,
                            visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                        });
                    })
            })
    }

    fetchPeopleData = (pageClicked) => {
            if(this.state.visitedPages.includes(pageClicked) ) {
                this.fetchDataForVisitedPage(pageClicked);
            }
            else {
                fetch(this.state.nextURL)
                    .then(response => response.json())
                    .then(result => {
                        if(result.next) {
                            this.dataFetchWithNextURL(result, pageClicked);
                        }
                        else {
                            this.dataFetchWithOutNextURL(result, pageClicked);
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            errorOccured: true
                        });
                    });
            }
    }

    fetchOnSearchName = () => {
        const name = this.state.searchName;
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
                            visitedPages: [],
                            errorOccured: false
                        }));
                })
            }
            else {
                this.fetchDataForFirstPage();
            }
    }

    handleNameChange = (e) => {
        this.setState({searchName: e.target.value}, () => {
            /*if (this.state.searchName === '') {
                this.props.fetchDataForFirstPage();
            }*/
        })
    }


    render() {
        const {people, errorOccured, loading} = this.state;
        return (
            <Col className={'search-table-style'}>
                <Row className={'name-search'}>
                    <Row className={'search-button'}>
                        <Input type={'text'}
                               value={this.state.searchName}
                               placeholder={'enter name to search'}
                               onChange={this.handleNameChange} />
                        <Button
                            onClick={this.fetchOnSearchName}
                            icon={<SearchOutlined />}
                            style={{ width: 30, height: 30, border: "none" }}
                        >
                        </Button>
                    </Row>
                </Row>
                <Row className={'table-style'}>
                    {
                        errorOccured ? <FontAwesomeIcon icon={faExclamationCircle} size="6x" /> :
                            <div>
                                {
                                    loading ? <FontAwesomeIcon icon={faSpinner} size="6x" /> :
                                    <div>{
                                        isEmpty(people) ? <FontAwesomeIcon icon={faExclamationTriangle} size="6x" /> :
                                            <PeopleTable people={people}
                                                         noOfPages={this.state.noOfPages}
                                                         fetchPeopleData={this.fetchPeopleData}
                                            />
                                    }
                                    </div>
                                }
                            </div>
                    }
                </Row>
            </Col>
        );
    }
}

export default StarWarHomePage;