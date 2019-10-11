import React, {PureComponent} from 'react';
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux';
import {
    HeaderWrapper,
    Logo,
    Nav,
    NavItem,
    NavSearch,
    Addition,
    Button,
    SearchWrapper,
    SearchInfo,
    SearchInfoTitle,
    SearchInfoSwitch,
    SearchInfoItem,
    SearchInfoList
} from './style';
import {actionCreators }from './store/index';
import {Link} from 'react-router-dom';

class Header extends PureComponent {

    getListArea = (show, list, handleMouseEnter, mouseIn, handleMouseLeave, switchList,) => {
        if (show || mouseIn) {
            return (
                <SearchInfo onMouseEnter = {handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                >
                    <SearchInfoTitle>热门搜索
                        <SearchInfoSwitch
                        onClick = {() => switchList(this.spinIcon)}
                        >
                            <i ref = {(icon) => {
                                this.spinIcon = icon
                            }} className = 'iconfont spin'>&#xe862;</i>
                            换一换</SearchInfoSwitch>
                    </SearchInfoTitle>
                    <SearchInfoList>
                        {list.map((item,index) => {
                            return (<SearchInfoItem key = {index}>{item}</SearchInfoItem>)
                        })}
                    </SearchInfoList>
                </SearchInfo>
            )
        }
    }

    render() {
        const {mouseIn, focused, handleInputFocus, handleInputBlur, list, page, handleMouseEnter, handleMouseLeave, switchList} = this.props;
        let pageList = [];
        for (let i = page * 10; i < (page + 1) * 10; i ++) {
            pageList.push(list[i]);
        }
        return (
            <HeaderWrapper>
                <Link to = '/'>
                <Logo /*href = "/"*/></Logo>
                </Link>
                <Nav>
                    <NavItem className = 'left active'>首页</NavItem>
                    <NavItem className = 'left'>下载App</NavItem>
                    <NavItem className = 'right'>登陆</NavItem>
                    <NavItem className = 'right'>
                        <i className = 'iconfont'>&#xe636;</i>
                    </NavItem>
                    <SearchWrapper>
                        <CSSTransition
                        in = {focused}
                        timeout = {200}
                        classNames = 'slide'
                        >
                            <NavSearch
                            onFocus = {() => handleInputFocus(list)}
                            onBlur = {handleInputBlur}
                            className = {focused ? 'focused' : ''} 
                            ></NavSearch>
                        </CSSTransition>
                        <i 
                        className = {focused ? 'focused iconfont zoom' : 'iconfont zoom'} 
                        >&#xe795;</i>
                        {this.getListArea(focused, pageList, handleMouseEnter, mouseIn, handleMouseLeave, switchList)}
                    </SearchWrapper>
                    <Addition>
                        <Button className = 'reg'>注册</Button>
                        <Button className = 'writter'>
                        <i className = 'iconfont'>&#xe607;</i>
                            写文章</Button>
                    </Addition>
                </Nav>
            </HeaderWrapper>
        )
    }
}

const mapState = (state) => {
    return {
        // focused: state.get('header').get('focused')
        focused: state.getIn(['header', 'focused']),
        list: state.getIn(['header', 'list']),
        page: state.getIn(['header', 'page']),
        totalPage: state.getIn(['header', 'totalPage']),
        mouseIn: state.getIn(['header', 'mouseIn'])
    }
}

const mapDispatch = (dispatch) => {
    return {
        handleInputFocus(list) {
            if (list.size === 0) {
                dispatch(actionCreators.getList());
            }
            const action = actionCreators.searchFocus();
            dispatch(action);
        },
        handleInputBlur() {
            const action = actionCreators.searchBlur();
            dispatch(action);
        },
        handleMouseEnter() {
            const action = actionCreators.mouseEnter();
            dispatch(action);
        },
        handleMouseLeave() {
            const action = actionCreators.mouseLeave();
            dispatch(action);
        },
        switchList(spinIcon) {
            let rotate = parseInt(spinIcon.style.transform.replace(/[^0-9]/ig, ''));
            if (!rotate) {
                rotate = 0;
            }
            spinIcon.style.transform = 'rotate(' + (rotate + 360) + 'deg)';
            const action = actionCreators.switchList();
            dispatch(action);
        }
    }
}

export default connect(mapState, mapDispatch)(Header);