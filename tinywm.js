var x11 = require( 'x11' );

/* Constants */
var MOD_1_MASK = 1 << 3,
    // TODO This won't be true for everyone
    KEYSYM_F1 = 67,
    GRAB_MODE_ASYNC = 1,
    NONE = 0;

/* Globals */
var start, attr;

x11.createClient( function( error, display ) {
    var X = global.X = display.client;

    X.GrabKey( display.screen[0].root, true, MOD_1_MASK, KEYSYM_F1, GRAB_MODE_ASYNC, GRAB_MODE_ASYNC );
    X.GrabButton( display.screen[0].root, true, x11.eventMask.ButtonPress | x11.eventMask.ButtonRelease | x11.eventMask.PointerMotion,
        GRAB_MODE_ASYNC, GRAB_MODE_ASYNC, NONE, NONE, 1, MOD_1_MASK );
    X.GrabButton( display.screen[0].root, true, x11.eventMask.ButtonPress | x11.eventMask.ButtonRelease | x11.eventMask.PointerMotion,
        GRAB_MODE_ASYNC, GRAB_MODE_ASYNC, NONE, NONE, 3, MOD_1_MASK );
} ).on( 'event', function( event ) {
    //console.log( event );

    if( event.name === 'KeyPress' && event.child !== 0 ) {
        X.RaiseWindow( event.child );
    } else if( event.name === 'ButtonPress' && event.child !== 0 ) {
        X.GetGeometry( event.child, function( error, attributes ) {
            start = event;
            attr = attributes;
        } );
    } else if( event.name === 'MotionNotify' && typeof start !== 'undefined' && start.child !== 0 ) {
        var xdiff = event.rootx - start.rootx,
            ydiff = event.rooty - start.rooty;
        X.MoveResizeWindow( start.child,
            attr.xPos + ( start.keycode === 1 ? xdiff : 0 ),
            attr.yPos + ( start.keycode === 1 ? ydiff : 0 ),
            Math.max( 1, attr.width + ( start.keycode === 3 ? xdiff : 0 ) ),
            Math.max( 1, attr.height + ( start.keycode === 3 ? ydiff : 0 ) ) );
    } else if( event.name === 'ButtonRelease' ) {
        start = undefined;
    }
} );
