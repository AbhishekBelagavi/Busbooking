import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import config from '../config';

class BusLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRoute: '',
            selectedBus: '',
            location: '',
            routes: [],
            buses: [],
        };
    }

    componentDidMount() {
        console.log('Component mounted');
        this.fetchRoutes();
        this.fetchBuses();
    }

    fetchRoutes = () => {
        console.log('Fetching routes...');
        fetch(config.baseUrl + '/railway/routes')
            .then((res) => res.json())
            .then((data) => {
                console.log('Routes fetched:', data);
                this.setState({ routes: data });
            })
            .catch((error) => {
                console.error('Error fetching routes:', error);
            });
    };

    fetchBuses = () => {
        console.log('Fetching buses...');
        fetch(config.baseUrl + '/railway/buses')
            .then((res) => res.json())
            .then((data) => {
                console.log('Buses fetched:', data);
                this.setState({ buses: data });
            })
            .catch((error) => {
                console.error('Error fetching buses:', error);
            });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        console.log('handleChange called with:', name, value);
        this.setState({ [name]: value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted');
        const { selectedBus, location } = this.state;
        if (!selectedBus) {
            toast.error('Please select a bus.');
            return;
        }
        if (!location) {
            toast.error('Please enter the location.');
            return;
        }
        // Submit bus location data to your backend API
        const formData = {
            bus: selectedBus,
            location: location
        };
        // Example of how to send data to the backend API using fetch
        fetch(config.baseUrl + '/railway/set-bus-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                toast.success('Bus location updated successfully!');
                // Reset form after successful submission
                this.setState({
                    selectedBus: '',
                    location: ''
                });
            } else {
                throw new Error('Failed to update bus location.');
            }
        })
        .catch(error => {
            console.error('Error updating bus location:', error);
            toast.error('Failed to update bus location. Please try again.');
        });
    };

    render() {
        const { routes, buses, selectedRoute, selectedBus, location } = this.state;
        console.log('Rendering component with state:', this.state);
        return (
            <Container style={{ width: '80%', marginTop: '1%', marginBottom: '1%' }}>
                <Row>
                    <Col sm={12}>
                        <h4>Set Bus Location</h4>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="selectRoute">Select Route</Label>
                                <Input
                                    type="select"
                                    name="selectedRoute"
                                    id="selectRoute"
                                    value={selectedRoute}
                                    onChange={this.handleChange}
                                >
                                    <option value="">Select a Route</option>
                                    {routes.map((route) => (
                                        <option key={route._id} value={route.name}>
                                            {route.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="selectBus">Select Bus</Label>
                                <Input
                                    type="select"
                                    name="selectedBus"
                                    id="selectBus"
                                    value={selectedBus}
                                    onChange={this.handleChange}
                                >
                                    <option value="">Select a Bus</option>
                                    {buses.map((bus) => (
                                        <option key={bus._id} value={bus.name}>
                                            {bus.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="location">Location</Label>
                                <Input
                                    type="text"
                                    name="location"
                                    id="location"
                                    value={location}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <Button color="primary" type="submit">
                                Set Location
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="text-center">
                        <h4 className="mt-5">Scan Your Ticket Here</h4>
                        {/* Add your code for ticket scanning/uploading */}
                        <Button color="secondary" size="lg" className="mt-3">
                            Upload
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default BusLocations;
