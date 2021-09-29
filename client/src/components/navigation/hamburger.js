import React, { Fragment, useState } from "react";
import { elastic as Menu } from 'react-burger-menu';
import { Link } from "react-router-dom";
import "./style.css";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
  


const HamburgerMenu = props => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    }
    return (
        <Fragment>
            <Navbar color="light" light expand="md">
            <NavbarBrand href="/">Motion Creatives</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} />
                <Collapse isOpen={collapsed} navbar>
                <Nav navbar>
                    <NavItem>
                        <NavLink><Link style={{ color: "black" }} to={"/"}>Main Homepage</Link></NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink><Link style={{ color: "black" }} to={"/create/listing/restricted"}>Homepage Content</Link></NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink><Link style={{ color: "black" }} to={"/create/bts"}>BTS Content</Link></NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink><Link style={{ color: "black" }} to={"/stills/create"}>Still's Content</Link></NavLink>
                    </NavItem>
                </Nav>
                </Collapse>
            </Navbar>
        </Fragment>
    );
}
export default HamburgerMenu;