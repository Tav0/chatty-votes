import React from 'react';
import { connect } from 'react-redux';
import {Panel, Row, Col} from 'react-bootstrap';
import VoteForm from '../containers/forms/VoteForm';
import {getquestion, updatevote, totalVotes} from '../actions/questions.js';
import {getMessages, sendMessage} from '../actions/chat.js';
import { isLoading, isError } from '../util/loadingObject';
import { Alert } from 'react-bootstrap';
import { Chart } from 'react-google-charts';

import Message from '../components/ChatBox/Message.js';
import Compose from '../components/ChatBox/Compose.js';
import ChatView from 'react-chatview';

import { subscribeToVotesForQuestion, unSubscribeToVotesForQuestion, subscribeToChatForQuestion, unSubscribeToChatForQuestion } from '../realtime/socket';


class QuestionPage extends React.Component {
    static contextTypes = {
        history: React.PropTypes.object.isRequired
    }

    static propTypes = {
        question: React.PropTypes.object,
        totalvotes : React.PropTypes.object,
        messages: React.PropTypes.object,
    }


    fetchData(params) {
        this.props.dispatch(totalVotes(params.qid));
        this.props.dispatch(getquestion(params.qid));
        this.props.dispatch(getMessages({qid: params.qid}));
    }

    componentWillMount() {
        this.fetchData(this.props.params);
    }

    componentDidMount() {
        unSubscribeToVotesForQuestion(this.props.params.qid);
        subscribeToVotesForQuestion(this.props.params.qid);

        unSubscribeToChatForQuestion(this.props.params.qid);
        subscribeToChatForQuestion(this.props.params.qid);
    }

    componentWillUnmount() {
        unSubscribeToVotesForQuestion(this.props.params.qid);

        unSubscribeToChatForQuestion(this.props.params.qid);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.params !== prevProps.params)
            this.fetchData(this.props.params);
    }

    updateVote(vote) {
        let prevVote = (this.props.survey.vote);
        let nextvote = Number(vote.vote);
        let qid = this.props.survey.question.id;
        this.props.dispatch(updatevote({nextVote: nextvote, prevVote: prevVote, qid: qid}));
    }

    sendMessage(msg) {
        let qid = this.props.survey.question.id;

        // Send the msg to the db
        console.log('Sending messag: ' + msg);
        this.props.dispatch(sendMessage({qid, msg}));
    }

    loadMoreHistory() {
        return null;
        // Load more chat history
    }

    render() {
        debugger;
        const question = this.props.survey;
        const messages = this.props.survey.result;

        if (isLoading(question)) return (<p>Loading...</p>);
        if (isError(question)) return (<Alert bsStyle='danger'>{question.error.response.statusText}</Alert>);

        console.log('Messages: ' + JSON.stringify(messages));

        const alternatives = question.question.choices.map((c) => ({
            value: String(c.id),
            description: c.description
        }))

        let temp = {vote: String(question.vote[0])}

        // Graph set up
        let fullData = [ ["Category", "Value"] ];

        // Create graph data array, desciptions not found in totalvotes
        // have value of 0
        for (let i = 0; i < question.question.choices.length; i++) {
            let descr = question.question.choices[i].description;
            let value = 0;
            for (let x = 0; x < question.voteresult.length; x++) {
                if (question.voteresult[x].description === descr) {
                    value = question.voteresult[x].count;
                    break;
                }
            }
            fullData.push([descr, value]);
        }

        var chatComponent;

        if (isLoading(question)) {
            chatComponent = <p> Loading... </p>;
        } else {
            chatComponent = 
                        <ChatView className="messageList"
                            flipped={true}
                            scrollLoadThreshold={15}
                            onInfiniteLoad={this.loadMoreHistory}>
                            {messages.map((m) => { 
                                return (
                                    <Message
                                        username={m.username}
                                        text={m.message}
                                        key={m.id}
                                        time={m.time} />
                                ); 
                            })}
                        </ChatView>
                        
        }
        
        return (
        <div>
            <Row>
                <Col xsOffset={0} xs={10} smOffset={0} sm={6}>
                    <Panel header={<h1>{question.question.question}</h1>}>
                        <VoteForm
                            onSubmit={v => this.updateVote(v)}
                            alternatives={alternatives}
                            description={question.question.description}
                            loadingStatus={question}//may work or not
                            initialValues={temp} />
                    </Panel>
                </Col>
                <Col xsOffset={0} xs={10} smOffset={0} sm={6}>
                    <Chart
                        chartType="ColumnChart"
                        data={fullData}
                        options={{
                            animation: {
                                duration: 200
                            },
                            vAxis: {
                                maxValue: 3
                            },
                            legend: 'none'
                        }}
                        graph_id="BarChart"
                        width="100%"
                        height="300px"
                        legend_toggle
                    />
                </Col>
                <Col xsOffset={0} xs={10} smOffset={1} sm={10}>
                    <Panel header={<h1>Discuss the question here!</h1>}>
                        <div className="message-display" style={{height: "225px"}}>
                            {chatComponent}
                            <Compose sendMessage={this.sendMessage.bind(this)} />
                        </div>
                    </Panel>
                </Col>
            </Row>
        </div>
        );
    }
}

function mapStateToProps(state) {
    debugger;
    if('username' in state.survey) {
        if(Object.keys(state.survey).length < 14) {
            state.survey.loadingStatus = "loading"
        } else {
            state.survey.loadingStatus = "ok"
        }
    } else {
        if(Object.keys(state.survey).length < 6) {
            state.survey.loadingStatus = "loading"
        } else {
            state.survey.loadingStatus = "ok"
        }
    }

    return {
        survey: state.survey,
    }
}

export default connect(mapStateToProps)(QuestionPage);
