import React, {Component} from 'react'

class Footer extends Component {

    render() {
        return (
            <div>
                <br/>
                <footer className="page-footer font-small" style={{
                    backgroundColor: '#4B4A4A',
                    color: 'white',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                }}>
                    <div className="footer-copyright text-center py-3">© 2024 Copyright
                        <p>Team Name</p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Footer