const miModulo = ( () => {
   'use strict';
    // Alzado de las variabless
    let deck       = [];
    const tipos    = ['H', 'D', 'C', 'S'],
          especial = ['A', 'J', 'Q', 'K'];

    let ptsTotales = [];

    // Elementos del DOM
    const btnPedir   = document.querySelector("#btnPedir"),
          btnDetener = document.querySelector("#btnDetener"),
          btnNuevo   = document.querySelector("#btnNuevo");

    const puntosHTML         = document.querySelectorAll("small"),
          divCartasJugadores = document.querySelectorAll(".divCartas");

    // fn que inicializa el juego
    const iniciarJuego = ( numJugadores = 2 ) => {
        deck       = baraja();
        ptsTotales = [];
        for(let i = 0; i < numJugadores; i++){
            ptsTotales.push(0);
        }
         
        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    // Crear el mazo
    const baraja = () => {

        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for (let tipo of tipos) {
            for (let esp of especial) {
                deck.push(esp + tipo);
            }
        }

        return _.shuffle(deck);
    }
    
    // Solicitar una carta
    const nuevaCarta = () => {
        
        if(deck.lenght === 0) {
            throw 'No hay más cartas';
        }
        return deck.pop();
    }

     // Obtener los valores
    const valorCarta = ( carta ) => {

        const valor = carta.substring(0, carta.length - 1);
        return ( isNaN( valor ) ) ? 
                ( valor === 'A' ) ? 11 : 10
                : valor * 1;
    }

    // Turno 0 = Primer jugador y el último será la computadora
    const acumularPts = ( carta, turno ) => {
        ptsTotales[turno] = ptsTotales[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = ptsTotales[turno];
        return ptsTotales[turno];
    }

    const mostrarCarta = ( carta, turno ) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`;
        imgCarta.classList.add("carta");
        divCartasJugadores[turno].append( imgCarta );
    }
    
    const quienGana = () => {

        const [ptsMinimos, ptsComputadora ] = ptsTotales;
        
        setTimeout(() => {
            if (ptsComputadora === ptsMinimos) {
                alert('Nadie gana ☹️');
            } else if (ptsMinimos > 21) {
                alert('CPU gana 💻');
                btnDetener.disabled = true;
            } else if (ptsComputadora > 21) {
                alert('Jugador gana 😎');
            } else {
                alert('CPU gana 💻');
                btnDetener.disabled = true;
            }
        }, 500);
    }
    // Turno Computadora
    const turnoCpu = (ptsMinimos) => {
        let ptsComputadora = 0;
        
        do {
            const carta = nuevaCarta();
            ptsComputadora = acumularPts(carta, ptsTotales.length - 1);
            mostrarCarta( carta, ptsTotales.length - 1);
            
            btnPedir.disabled = true;
        
        } while ((ptsComputadora < ptsMinimos) && (ptsMinimos <= 21));

        quienGana();
    }

    // Eventos con el click
    btnPedir.addEventListener('click', () => {
        const carta = nuevaCarta();
        const ptsJugador = acumularPts(carta, 0);
        
        mostrarCarta( carta, 0);

        // Situacion alcanzado el 21
        if (ptsJugador > 21) {
            console.warn('Lo siento, perdiste!');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoCpu(ptsJugador);

        } else if (ptsJugador === 21) {
            console.warn('21, Genial!');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoCpu(ptsJugador);
        }
    });

    

    // Boton detener
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;
        turnoCpu( ptsTotales[0] );
    });

    // // Boton Reiniciar 
    // btnNuevo.addEventListener('click', () => {
        
    //     iniciarJuego();

    // })

    return {
        nuevoJuego: iniciarJuego
    };

})();