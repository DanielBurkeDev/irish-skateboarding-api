import { getAuth } from '@clerk/express';

export function requireAuth(req, res, next) {
    const { userId, sessionId, getToken } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    // Attach user info to the request object
    req.auth = { userId, sessionId };

    next();
}
// export const requireAuth = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
//
//         console.log('🪪 Incoming Authorization Header:', authHeader);
//
//         if (!authHeader?.startsWith('Bearer ')) {
//             return res.status(401).json({ error: 'Missing token' });
//         }
//
//         const token = authHeader.split(' ')[1];
//         console.log('🔍 Extracted Token:', token);
//
//         console.log('🛡️ Verifying token...');
//
//         const payload = await verifyJwt(token, {
//             issuer: 'https://proud-chamois-23.clerk.accounts.dev',
//         });
//
//         console.log('✅ Token verified, payload:', payload);
//
//         req.auth = {
//             userId: payload.sub,
//             email: payload.primary_email_address, // If present in your JWT template
//             ...payload,
//         };
//
//         next();
//     } catch (err) {
//         console.error('❌ Token verification failed:', err);
//         return res.status(401).json({ error: 'Unauthorized', details: err.message });
//     }
// };



// export const requireAuth = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
//
//         if (!authHeader?.startsWith('Bearer ')) {
//             return res.status(401).json({ error: 'Missing token' });
//         }
//
//         const token = authHeader.split(' ')[1];
//         const payload = await verifyToken(token, {
//             // This must match your Clerk JWT template's configured issuer
//             issuer: 'https://proud-chamois-23.clerk.accounts.dev',
//         });
//         console.log('🛡️ Verifying token...');
//         console.log('✅ Token verified, payload:', payload);
//
//
//         req.auth = {
//             userId: payload.sub, // Clerk user ID
//             email: payload.email, // If included in template
//             ...payload, // You can include everything if needed
//         };
//
//
//         next();
//     } catch (err) {
//         return res.status(401).json({ error: 'Unauthorized', details: err.message });
//     }
// };