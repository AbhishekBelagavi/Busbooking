import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import config from '../config';
import jsQR from 'jsqr'; // Import jsQR library
import {getReservation} from '../Services'

class BusLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: '',
            selectedBus: '',
            location: '',
            routes: [],
            uniqueRouteNames: [],
        
            qrData: null,
            result:null, // State to store QR code data
            // State to store API call result
        };
    }

    componentDidMount() {
        console.log('Component mounted');
        this.fetchRoutes();
    }

    fetchRoutes = () => {
        console.log('Fetching routes...');
        fetch(config.baseUrl + '/railway/routes')
            .then((res) => res.json())
            .then((data) => {
                console.log('Routes fetched:', data);
                this.setState({ routes: data });
                let uniqueRouteNames = [];
                data.forEach((object) => {
                    object.route.forEach((route) => {
                        if (!uniqueRouteNames.includes(route.name)) {
                            uniqueRouteNames.push(route.name);
                        }
                    });
                });
                this.setState({ uniqueRouteNames: uniqueRouteNames });
            })
            .catch((error) => {
                console.error('Error fetching routes:', error);
            });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            image.src = event.target.result;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    let qrdataurl = code.data
                    qrdataurl= qrdataurl.replace('http://localhost:3000/ticket/', '');
                    this.setState({ qrData: qrdataurl });
                    console.log('QR Code Data:', qrdataurl);
                    // Simulate API call with the QR code data
                    getReservation(this.state.qrData).then(res => {
                        // res = res.json()
                        // this.setState({data: res})
                        let hi = res.from

                        if(this.state.selectedLocation == ''){
                            toast.error('Select location')
                        }else{
                            if(hi == this.state.selectedLocation){
                                toast.success("Valid Ticket")
                            }else{
                                toast.error("Invalid ticket")
                            }
                        }
                        console.log(hi)
                    }).catch(err => {
                        console.log(err)
                    })
                    // this.simulateAPICall();
                } else {
                    console.log('No QR code found.');
                    toast.error('No QR code found.')
                }
                

                
            };
        };

        event.target.value = null;
        reader.readAsDataURL(file);
    };

  
    

    render() {
        const { selectedLocation, uniqueRouteNames, qrData, apiResult } = this.state;
        return (
            <Container style={{ width: '80%', marginTop: '1%', marginBottom: '1%' }}>
                <Row>
                    <Col sm={12}>
                        <h4>Set Bus Location</h4>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="selectRoute">Select Location</Label>
                                <Input
                                    type="select"
                                    name="selectedLocation"
                                    id="selectRoute"
                                    value={selectedLocation}
                                    onChange={this.handleChange}
                                >
                                    <option value="">Select a Location</option>
                                    {uniqueRouteNames.map((routeName, index) => (
                                        <option key={index} value={routeName}>
                                            {routeName}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="text-center">
                        <h4 className="mt-5">Scan Your Ticket Here</h4>
                        <input type="file" accept="image/png" onChange={this.handleFileUpload} />
                        
                       
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default BusLocations;
