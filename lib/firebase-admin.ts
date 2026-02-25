import * as admin from "firebase-admin";

if (!admin.apps.length) {
    try {
        // Hardcoded credentials for build stability (as requested by user)
        const projectId = "ticket-maintenance-96997";
        const clientEmail = "firebase-adminsdk-fbsvc@ticket-maintenance-96997.iam.gserviceaccount.com";
        const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTB/b+M8nnGFEi\nVtkKGhV3yDiRY+M1JZgOzHR/O9idlkdMSAdkU0s8aAqDk9/s0l+lHbHrL5E/GpcT\nfniNAT13rLVzZ/pJSk7xnXvJBDupygM8z4sueIgiiFe3HSBn6XtfpdBhbCdARQj4\nb1cpIBR/qGd/1pzwM+oHF3QYCMjXX5/HABaQIRWvhXSfaSMVKVioPDd4MRpir2n9\nklcSdOtrJdtxszhzov5iP+Ynmt7/IMvk3nyBReu4YMs/uc/x9qJDPlLYgQIjc8Yq\ncl2q5QUefUnzndK2ELISo4L02aTcuVktoXRSS/d0c+lmUJRmM50+a8tdTLvZe2aC\ngeDguG/VAgMBAAECggEARiegsdNPrLbFyi+rCZOwTVjPjW3yi6mKymin1eB0W7co\nzrAnXO/f1B4WWLWhPJ6XU1Hy4ue2Vo8laEKkGuQtpgpRbCNF7nV4lxQuoZ35o7FX\nsDCi6XkCcNB4sJRLQKA69oouIyUMS25n1AdXp4FVrzax6arUE3p+s4rVemP5OLej\n37fn+tCTnoiSXq0zS4hPNFJmvf3IjDZK8ezTRxmo1uBJgoO88F7J7P5sCFWcgjZu\nbcmYcMfJrqVTszae3Bd70muamy8b0keDe2GNIQQGWbCnnkPGdriiVWxSCAxmMx2j\n3XTZXSc/FkgBQKYEu5Vc/pO4/oTiKgB7/DQ5stP2ZQKBgQDqWrS6JlPmeNlXPfee\nzoXYerq6FneFkFUG+6XA2gBHTudnS46xUiaT6euCFj1zg3Z1u4+llKg1M7NsUqc7\nCByq43DhoOZ/jC3MBILvr3xpeE7k1eArrpsdwp2ekPGbanSJNzTe0UD/pMgBmjKr\nB1QKjPUwxxEBD8TPiZItSNIe+wKBgQDmhchx00ad7AWCyAPscaYWvIhx8bpxy2wg\nqesdmzpZcZhrfdG4Ka3VXQ2zqoItFIkEdc0OhX6I0SKcCDkuFGsIzQDQQTTuIqA7\nj/fQLtZNiaPefvTtoTtnYSKgq4GwvRVvokjsqp6O+22KkGxKzqy2MOiSyCw8JXxh\nOCBEFYMzbwKBgQCTq7RV1/DmOSA6qQFvQBN25V7kA2Qs9VWeoNNBQh0K0d1eaW3w\nriNA8RVFU15Fe4EZjqZlX9beL0XP7AUUXXgy9j4a7phPprT06aLYBWwPyY9tApfO\n7qcviYJoeEzF8b6c9/yIqrKaY+rjl5Z1zphWTZvysH02fgk1/Snu/wPoIQKBgQC4\nlbVcF337JCuBfiFOKe6BVDO5cYMGbYnGWejvCwXc6w3OPLA6U/1i1KENFWIpMMFK\nNf2dPB2G9ldNM3R9xlGyeVzGZQA6ErXVG8GmDGsDKUxy85uxz6HedLQijVJKsA1D\nF2JnR3OxL/iVtHFSMU2wkVcZeXmaK7X9rtB/U+57twKBgAKB9fFxLekkT9IR5p1y\nwVfx6xwQSolOTIVAGReMMoORQyTa7etx2mALtdzwU4lUY4Ycn/XLmKgpJ8FeNdQZ\novpcxpRAwcg3ybD2S0xz6bKuu51sI88YkkCJ//vUJWhCXnjZ66kbutxX8Lnd8d0y\nYx8UZuqhiKBEouf3EzgtQ92\n-----END PRIVATE KEY-----";

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: projectId,
                clientEmail: clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
                // @ts-ignore
                project_id: projectId,
            }),
        });
        console.log("Firebase Admin initialized successfully with hardcoded credentials");
    } catch (error) {
        console.error("Firebase admin initialization error", error);
    }
}

export const adminMessaging = admin.messaging();
