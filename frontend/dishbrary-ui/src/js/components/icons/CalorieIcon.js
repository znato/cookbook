import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
    icon: {
        fill: "#000000"
    },
};

const CalorieIcon = (props) => {
    const {classes} = props;

    return (
        <SvgIcon x="0px" y="0px"
                 viewBox="0 0 192 192"
                 className={classes.icon}>
            <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt"
               strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0"
               fontFamily="Roboto" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: "normal"}}>
                <path d="M0,192v-192h192v192z" fill="none"></path>
                <g>
                    <g id="surface1">
                        <path
                            d="M24,40c0,-8.84375 7.15625,-16 16,-16h112c8.84375,0 16,7.15625 16,16v112c0,8.84375 -7.15625,16 -16,16h-112c-8.84375,0 -16,-7.15625 -16,-16z"
                            fill="#000000" fill-opacity="0.54"></path>
                        <path
                            d="M59.34375,105.40625l-2.40625,2.82812v11.09375h-8.9375v-51.32812h8.95312v27.73438l1.10938,-1.73438l6.1875,-10.82812h10.65625l-9.92188,14.90625l10.875,21.25h-10.25z"
                            fill="#ffffff"></path>
                        <path
                            d="M90.71875,112.21875c2.57812,0 3.90625,-1.8125 3.9375,-5.42188h8.42187c-0.04687,3.9375 -1.1875,7.125 -3.45312,9.5625c-2.25,2.42188 -5.15625,3.64062 -8.71875,3.64062c-4.40625,0 -7.76563,-1.45312 -10.09375,-4.34375c-2.3125,-2.89063 -3.5,-7.17188 -3.53125,-12.79688v-2.875c0,-5.6875 1.14062,-10.01562 3.4375,-13c2.28125,-2.98438 5.65625,-4.48438 10.125,-4.48438c3.76562,0 6.75,1.23438 8.92187,3.70312c2.15625,2.45313 3.26563,5.9375 3.3125,10.46875h-8.40625c-0.03125,-2.04688 -0.34375,-3.625 -0.95312,-4.73438c-0.60938,-1.09375 -1.625,-1.65625 -3.03125,-1.65625c-1.5625,0 -2.67188,0.59375 -3.35938,1.78125c-0.67187,1.17188 -1.03125,3.45312 -1.07812,6.82812v3.70313c0,2.95312 0.14062,5.03125 0.42188,6.20312c0.26562,1.17188 0.71875,2.04688 1.35938,2.59375c0.625,0.54688 1.51562,0.82813 2.6875,0.82813z"
                            fill="#ffffff"></path>
                        <path
                            d="M124.39062,119.32812c-0.26562,-0.54687 -0.51562,-1.48437 -0.76562,-2.79687c-1.59375,2.3125 -3.76562,3.46875 -6.51562,3.46875c-2.85938,0 -5.23438,-1 -7.125,-3.01562c-1.89062,-2 -2.82812,-4.59375 -2.82812,-7.78125c0,-3.78125 1.14062,-6.71875 3.42187,-8.78125c2.29688,-2.07812 5.59375,-3.125 9.89063,-3.17188h2.71875v-2.90625c0,-1.625 -0.26562,-2.78125 -0.79688,-3.45313c-0.51562,-0.67187 -1.29687,-1 -2.29687,-1c-2.23438,0 -3.35938,1.39063 -3.35938,4.14063h-8.9375c0,-3.34375 1.17188,-6.09375 3.5625,-8.26563c2.35938,-2.17187 5.35938,-3.25 8.98438,-3.25c3.75,0 6.65625,1.03125 8.71875,3.07813c2.04688,2.0625 3.07812,5.01562 3.07812,8.84375v17.01562c0.04688,3.10938 0.45313,5.5625 1.26563,7.3125v0.57813h-9.01563zM119.09375,112.57812c1,0 1.84375,-0.20312 2.53125,-0.625c0.70312,-0.42187 1.21875,-0.92187 1.5625,-1.51562v-7.51562h-2.15625c-1.51563,0 -2.71875,0.51562 -3.57813,1.54688c-0.875,1.01562 -1.3125,2.39062 -1.3125,4.10937c-0.01562,2.67188 0.98438,4 2.95313,4z"
                            fill="#ffffff"></path>
                        <path d="M148,119.32812h-8.98438v-51.32812h8.98438z" fill="#ffffff"></path>
                    </g>
                </g>
                <path
                    d="M96,192c-53.01934,0 -96,-42.98066 -96,-96v0c0,-53.01934 42.98066,-96 96,-96v0c53.01934,0 96,42.98066 96,96v0c0,53.01934 -42.98066,96 -96,96z"
                    fill="none"></path>
                <path
                    d="M96,188.16c-50.89856,0 -92.16,-41.26144 -92.16,-92.16v0c0,-50.89856 41.26144,-92.16 92.16,-92.16v0c50.89856,0 92.16,41.26144 92.16,92.16v0c0,50.89856 -41.26144,92.16 -92.16,92.16z"
                    fill="none"></path>
                <path d="M0,192v-192h192v192z" fill="none"></path>
                <path d="M3.84,188.16v-184.32h184.32v184.32z" fill="none"></path>
            </g>
        </SvgIcon>
    );
}

export default withStyles(styles)(CalorieIcon);