import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation =

//login y registor
  trigger('routeAnimations', 
 [
        transition('login => registro', [
        query(':enter, :leave', 
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ opacity: 0 }),
            animate('0.5s ease-out',
              style({ opacity: 1 })
            )
          ], { optional: true }),
          query(':leave', [
            style({ opacity: 1 }),
            animate('0.5s ease-out',
              style({ opacity: 0 })
            )
          ], { optional: true }),
        ])
    ]),

    transition('registro => login', [
        query(':enter, :leave', 
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateY(-100%)' }),
            animate('0.5s ease-out',
              style({ transform: 'translateY(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate('0.5s ease-out',
              style({ transform: 'translateY(100%)' })
            )
          ]
          , { optional: true }),
        ])
    ]),  
    
    //Administración
    transition('administracionPerfiles => administracionUsuarios', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(100%)' })
            )
          ], { optional: true }),
        ])
      ]),

      transition('administracionUsuarios => administracionPerfiles', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(-100%)' })
            )
          ], { optional: true }),
        ])
    ]),

    transition('administracionPerfiles => administracionSacarTurno', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(100%)' })
            )
          ], { optional: true }),
        ])
      ]),
      
      transition('administracionSacarTurno => administracionPerfiles', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(-100%)' })
            )
          ], { optional: true }),
        ])
    ]),

    transition('administracionSacarTurno => administracionUsuarios', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(100%)' })
            )
          ], { optional: true }),
        ])
      ]),
      
      transition('administracionUsuarios => administracionSacarTurno', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(-100%)' })
            )
          ], { optional: true }),
        ])
    ]),
    
    transition('administracionGraficos => administracionSacarTurno', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%' }),
        { optional: true }
      ),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s .5s ease-in-out',
            style({ transform: 'translateX(0%)' })
          )
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate('0.5s .5s ease-in-out',
            style({ transform: 'translateX(-100%)' })
          )
        ], { optional: true }),
      ])
  ]),

  transition('administracionSacarTurno => administracionGraficos', [
    query(':enter, :leave',
      style({ position: 'fixed', width: '100%', height: '100%' }),
      { optional: true }
    ),
    group([
      query(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s .5s ease-in-out',
          style({ transform: 'translateX(0%)' })
        )
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s .5s ease-in-out',
          style({ transform: 'translateX(100%)' })
        )
      ], { optional: true }),
    ])
  ]),
]);