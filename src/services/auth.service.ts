import jwt from 'jsonwebtoken';

const SECRET: string = process.env.SECRET || 'secret';

const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, SECRET, { expiresIn: '1h' });
};

const verifyToken = (token?: string): { id: string } | null => {
    if (!token) return null;
    try {
        return jwt.verify(token, SECRET) as { id: string };
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
};

const validateUserId = (userId: string, token?: string): boolean => {
    if (!token) return false;
    const decoded = verifyToken(token);
    return decoded?.id === userId;
};

export { generateToken, validateUserId, verifyToken };
