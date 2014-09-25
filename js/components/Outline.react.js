/**
 * Copyright 2013-2014 Atlassian, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @jsx React.DOM
 */

var OutlineStore = require('../stores/OutlineStore');
var Node = require('./Node.react');
var _ = require('underscore');

var getStateFromStores = function () {
  return {
    nodes: OutlineStore.getAll(),
  };
}

var getNode = function(node, key) {
  return <Node
            key={key}
            time={node.time}
            place={node.place}
            creator={node.creator}
            attendees={node.attendees}
          />
}

var React = require('react');

var Outline = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    OutlineStore.addChangeListener(this._onChange);
  },

  render: function() {
    var nodes = _.map(this.state.nodes, getNode)

    return (
      <div className="row clearfix">
        <div className="panel panel-primary filterable">
            <div className="panel-heading">
                <h3 className="panel-title">Events</h3>
            </div>
            <table className="table">
                <thead>
                    <tr className="filters">
                        <th>Time</th>
                        <th>Location</th>
                        <th>Attendees</th>
                        <th>Organizer</th>
                    </tr>
                </thead>
                <tbody>
                  {nodes}
                </tbody>
            </table>
        </div>
      <a id="add_row" className="btn btn-default pull-right">Add Row</a>
      </div>
    );

  },

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = Outline;
