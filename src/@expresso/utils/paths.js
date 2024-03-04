module.exports = {
  '/auth/sign-in': {
    post: {
      tags: ['Authentication'],
      summary: 'Login',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                email: 'admin@mail.com',
                password: 'abcdeFG6*$',
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'OK',
          headers: {
            'Content-Security-Policy': {
              schema: {
                type: 'string',
                example:
                  "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
              },
            },
            'Cross-Origin-Embedder-Policy': {
              schema: {
                type: 'string',
                example: 'require-corp',
              },
            },
            'Cross-Origin-Opener-Policy': {
              schema: {
                type: 'string',
                example: 'same-origin',
              },
            },
            'Cross-Origin-Resource-Policy': {
              schema: {
                type: 'string',
                example: 'same-origin',
              },
            },
            'X-DNS-Prefetch-Control': {
              schema: {
                type: 'string',
                example: 'off',
              },
            },
            'Expect-CT': {
              schema: {
                type: 'string',
                example: 'max-age=0',
              },
            },
            'X-Frame-Options': {
              schema: {
                type: 'string',
                example: 'SAMEORIGIN',
              },
            },
            'Strict-Transport-Security': {
              schema: {
                type: 'string',
                example: 'max-age=15552000; includeSubDomains',
              },
            },
            'X-Download-Options': {
              schema: {
                type: 'string',
                example: 'noopen',
              },
            },
            'X-Content-Type-Options': {
              schema: {
                type: 'string',
                example: 'nosniff',
              },
            },
            'Origin-Agent-Cluster': {
              schema: {
                type: 'string',
                example: '?1',
              },
            },
            'X-Permitted-Cross-Domain-Policies': {
              schema: {
                type: 'string',
                example: 'none',
              },
            },
            'Referrer-Policy': {
              schema: {
                type: 'string',
                example: 'no-referrer',
              },
            },
            'X-XSS-Protection': {
              schema: {
                type: 'integer',
                example: '0',
              },
            },
            Vary: {
              schema: {
                type: 'string',
                example: 'Origin, Accept-Encoding',
              },
            },
            'Content-Language': {
              schema: {
                type: 'string',
                example: 'en',
              },
            },
            'Set-Cookie': {
              schema: {
                type: 'string',
                example:
                  'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI0MjVlNmU2My0zYjU2LTQ5MzYtYTczNS1mMWM2NDIxYzJiNDQiLCJpYXQiOjE2NjE0OTY0MjIsImV4cCI6MTY2MTU4MjgyMn0.VDCNAmSu_6DKem5Fdb_8TvyTT8EkEovNBq2aCvaN42Q; Max-Age=86400; Path=/v1; Expires=Sat, 27 Aug 2022 06:47:02 GMT; HttpOnly',
              },
            },
            'Content-Type': {
              schema: {
                type: 'string',
                example: 'application/json; charset=utf-8',
              },
            },
            'Content-Length': {
              schema: {
                type: 'integer',
                example: '337',
              },
            },
            ETag: {
              schema: {
                type: 'string',
                example: 'W/"151-WQSrB6lKyaMQuEhTTcCHFSHuDTg"',
              },
            },
            Date: {
              schema: {
                type: 'string',
                example: 'Fri, 26 Aug 2022 06:47:02 GMT',
              },
            },
            Connection: {
              schema: {
                type: 'string',
                example: 'keep-alive',
              },
            },
            'Keep-Alive': {
              schema: {
                type: 'string',
                example: 'timeout=5',
              },
            },
          },
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              example: {
                code: 200,
                message: 'Berhasil masuk',
                accessToken:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI0MjVlNmU2My0zYjU2LTQ5MzYtYTczNS1mMWM2NDIxYzJiNDQiLCJpYXQiOjE2NjE0OTY0MjIsImV4cCI6MTY2MTU4MjgyMn0.VDCNAmSu_6DKem5Fdb_8TvyTT8EkEovNBq2aCvaN42Q',
                expiresIn: 86400,
                tokenType: 'Bearer',
                user: {
                  uid: '425e6e63-3b56-4936-a735-f1c6421c2b44',
                },
              },
            },
          },
        },
      },
    },
  },
}
