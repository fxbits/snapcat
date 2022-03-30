export const addressValidation = (e: any, setErrorState: (msg: string) => void) => {
    const value = e.target.value;

    if (value === 'acasa') {
        setErrorState("Adresa nu poate fi casa ta!");
        return;
    }

    if (value === '') {
        setErrorState("Adresa nu poate fi vida!");
        return;
    }

    setErrorState("");  
    return;
}

export const nonSterilizedCatsValidation = (e: any, setErrorState: (msg: string) => void) => {
    const value = e.target.value;

    if (value < 0) {
        setErrorState("Numarul de pisici nu poate sa fie mai mic decat 0!");
        return;
    }

    if(value > 100) {
        setErrorState("Numarul de pisici nu poate sa fie mai mare decat 100!");
        return;
    }

    if (value === '') {
        setErrorState("Numarul de pisici nu poate sa fie vid");
        return;
    }

    setErrorState("");
    return;  
}

export const sterilizedCatsValidation = (e: any, setErrorState: (msg: string) => void) => {
    const value = e.target.value;

    if (value < 0) {
        setErrorState("Numarul de pisici nu poate sa fie mai mic decat 0!");
        return;
    }

    if(value > 100) {
        setErrorState("Numarul de pisici nu poate sa fie mai mare decat 100!");
        return;
    }

    if (value === '') {
        setErrorState("Numarul de pisici nu poate sa fie vid");
        return;
    }

    setErrorState("");
    return;  
}

export const nameValidation = (e: any, setErrorState: (msg: string) => void) => {
    const value = e.target.value;

    const nameVerif = new RegExp('^[A-Z][a-z ,.-]+$');

    if (value === '') {
        setErrorState("Numele nu poate fi vid!");
        return;
    }

    if (!nameVerif.test(value)) {
        setErrorState("Nume invalid!");
        return;
    }

    setErrorState("");  
    return;
}
