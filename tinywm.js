var x11 = require( 'x11' ),
    start, attr;

x11.createClient( function( error, display ) {
    var X = global.X = display.client;

    X.GrabKey( display.screen[0].root, true, 1 << 3 /* Mod1 */, 67 /* TODO F1 */, 1 /* Async */, 1 /* Async */ );
    X.GrabButton( display.screen[0].root, true, x11.eventMask.ButtonPress | x11.eventMask.ButtonRelease | x11.eventMask.PointerMotion,
        1 /* Async */, 1 /* Async */, 0 /* None */, 0 /* None */, 1 /* Button */, 1 << 3 /* Mod1 */ );
    X.GrabButton( display.screen[0].root, true, x11.eventMask.ButtonPress | x11.eventMask.ButtonRelease | x11.eventMask.PointerMotion,
        1 /* Async */, 1 /* Async */, 0 /* None */, 0 /* None */, 3 /* Button */, 1 << 3 /* Mod1 */ );
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
