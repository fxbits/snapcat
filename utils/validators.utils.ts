export const addressValidation = (e: any, setError: (msg: string) => void) => {
    const value = e.target.value;

    if (value === 'acasa') {
        setError("Adresa nu poate fi casa ta!");
        return;
    }

    if (value === '') {
        setError("Adresa nu poate fi vida!");
        return;
    }

    setError("");  
    return;
}

export const nonSterilizedCatsValidation = (e: any, setError: (msg: string) => void) => {
    const value = e.target.value;

    if (value < 0) {
        setError("Numarul de pisici nu poate sa fie mai mic decat 0!");
        return;
    }

    if(value > 100) {
        setError("Numarul de pisici nu poate sa fie mai mare decat 100!");
        return;
    }

    if (value === '') {
        setError("Numarul de pisici nu poate sa fie vid");
        return;
    }

    setError("");
    return;  
}

export const sterilizedCatsValidation = (e: any, setError: (msg: string) => void) => {
    const value = e.target.value;

    if (value < 0) {
        setError("Numarul de pisici nu poate sa fie mai mic decat 0!");
        return;
    }

    if(value > 100) {
        setError("Numarul de pisici nu poate sa fie mai mare decat 100!");
        return;
    }

    if (value === '') {
        setError("Numarul de pisici nu poate sa fie vid");
        return;
    }

    setError("");
    return;  
}

export const nameValidation = (e: any, setError: (msg: string) => void) => {
    const value = e.target.value;

    const nameVerif = new RegExp('^[A-Z][a-z ,.-]+$');

    if (value === '') {
        setError("Numele nu poate fi vid!");
        return;
    }

    if (!nameVerif.test(value)) {
        setError("Nume invalid!");
        return;
    }

    setError("");  
    return;
}
