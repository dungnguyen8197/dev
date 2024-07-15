const crypto = require('crypto')
const PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\n' +
  'MIIEowIBAAKCAQEAvxHbc0hp99ruk6JnHBI97c7xDefM206eV7kOVHofNHvT/pJr\n' +
  '+bQxtjD6M1OI56MT4ytgY8x0M/ecq3Gc1JtMWzv2VK6fa9OGtR105LaDxhndV7Ss\n' +
  'JTErbVpzlIR/X6W8VSZ/ujCSQt5GXznJXP/avrQM+o8thTVDDEBEmfEv5h38juz1\n' +
  'L//lCBrL4KXRCvyb1nk1GvGBcA+mHCKRSGv22a9PsWRNjveTveY8VBFBlj8jkrL1\n' +
  'OQ0QCl+tRajIaFOadNYx3S+KTxAYSjYS+vUQuKh7qufNWQmwpAcbDsGHLvuyNNGA\n' +
  'DMMLG8jqJ22H/WY0MEjd4Rf+CTvNlRx3UryKywIDAQABAoIBAHlVy7hP2gtt2mei\n' +
  'kDwBUZZ8/hNIio0SRfeLKxB2ZO6dXCijrzHpPlBmldyWRbBjnTN7zkBSC9Ecgz9U\n' +
  'bLWO0VR2pZ1tLwv4TekiBaNgTBo3Ppp9v3v2148gC5na8lA5HXotcps4UQlpweKi\n' +
  '/b6zM6Q7Dqrm1Y9sHWHgRjBEO5izg6148yd8u4zosLgtTW9A02R3qfhxojNcKKkj\n' +
  'FHINkPXljhWbHVPCu+Gtf6EbIipUTlI5ZzdsRf4pFrAuzlBSljDuj5g1GXppQl0o\n' +
  'nbAl+nH/AYkMcXig5Wy8GiNQWeTOJI+IlYkmDEgeNa7dZiWyUEzsw/y068NquyXV\n' +
  'aNeObaECgYEA9nQFE9JpH6MduXkybfhcPqe2XEetW6vf6G6lzbag2CFf9NHruIbO\n' +
  '6MQ1fs7hUgsYV+uyPyPckZdwy5rGLVSrVYg7xAy3vK6hGKLFzHMqbpZulIpdoQ6h\n' +
  'EXfFSaV47W8PbSQcQtW2OS82RsNmnyYgBmwgR3Or91LJgfgF1WFuiukCgYEAxnif\n' +
  'EjDlJ8dbWOQvL1/x+VQkOtZrBOBCHtvCFyHtjFARny5MF07+2rS9SwGPO/5o18qh\n' +
  '05dQkd8pqDIBVYMixee9OqgGnG66PDQoyyUwqmBea02tYRLTBk5QHsv4XpF0519W\n' +
  'cVqn26RXsuW8jDv3WF/AmjUe6X4S76yvM9FyL5MCgYAQfWjNj7mK7V4Sx+Iw63o4\n' +
  'kv4npIAb7x8XLTgY0Ixoiasi9VzBRvvXJTGzH2KCG83wLAwMH3kloK1iYiO6arzg\n' +
  'BzKAhp1QmZqbzGBRsq73IUea1rs3CISMZ6giqliyAklU8yKU8jm0D82g5HgcU++2\n' +
  'nkt2nG24Kajj8lVplpBP6QKBgGfNBkUZVYBsf5YKIbOBVqi0HQ64vdgbAfnpraUz\n' +
  'lW3hIpZCPIGkSx5PkQD9m9AgyuyxidmENhtUwBC7tn7myvT+srVO08ZVEwoRrZQx\n' +
  'qzYwmLE+OwOeOMf/hV/WBdxP7vhjoG5An7H8TfG+vdIKOt75lV4Rkk1EJts7UZak\n' +
  'YDgJAoGBAIG/jcoAOzOUCubRDZ/1aAfyBMiP9DFMz1ql4bKMgsWo83EIo/GEtHyC\n' +
  '4E7P4vVSDAGI8BuZClil8J4Vv4HplBVo3Kb3BomsRWeJnQ4H2G0k0fScowAK/0+F\n' +
  'qmomlkPn8kh86SqqE3R0EiNTVIvJ56Fs6i4EG208Z/BijY3AShwm\n' +
  '-----END RSA PRIVATE KEY-----'

const T99_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAgwEoTCHm3dqxZDAQj07GNszIHW+M1Ec5kXjB7f8nBrCB1SQh
BpNofq/Han7rz/cUrvYA6m55BYf589IVnt5E7hmLFlz/q0PY6JHDywDPWjibuWKx
8LVYYM6yo7mP/oOIW2Kjpc29jZVwAaEuBZq7QIL1c4oFXkO3LOP78f2//rNdEj3M
hCsKaMIDPsXddw2dCVAzxBGrp4Eqkz3pr0iNLLLXHa66ZOfvtXLi3ejBvuqgHxhF
7aZUW87OOSDVA69fNXBqQKi7M9gXMFT6qj5qdz7gLEZNS0cHeCpwLiZbPoVCHcow
RU5kwLIZUfQa/d+QlSQK5BtrwNE2EftYlUwmPwIDAQABAoIBAAvCf9aNuIazyfa/
Zc0neh2TNmeGCvNHTYCkgWwW2m78SztR2fEYLGoq51DFAfASMvYduSlSL2TyttpP
QoeXVkK1YknooT7DgWYnJ5dChFqJ+Fik5mpALSXLiDewQZ/MOOJTMXOBy4E5J+vN
hy8Tm7mHx/bOLfsvQvMxp/0qFSEM4ahKo7zdF7FYf7Wlcvu/hxKxspz4S9jrEzjA
EtvTHfo3o9wSxSDAl54CREaL9yDWCdqSuPk8P/thw/ygeh3alkMTRoBvZApDbpJw
LxBbiiRYBcm5D0P2rZHWA/cS1wgmtgr40FhBIleaCJwNn58iBdyuEcWEfDpLLYGV
+FSR2IkCgYEA0EY9V/O27gwkH3LMxSDII6FpgnK+dkevyhFTT12/7npE6J55FZ0L
cflC1IR1d/rYU/YTHrpa3ijZI8GGaJ+dEejjD37EmWI3uYiT85Q/JK+z5T8CUEBQ
zCEUjm1TuRNYq1RtpUsI32owB8y1IH9qPgc9qWnEdH3P1ut1BB7PwR0CgYEAoQYg
C80fA6tqGrTnLtNmHlGhnuG2YzrgeH3xlQ69JsEneiZS9tPiOBWo+PKzUCvZFqdG
tO5mhMrs/YVKUrPZB+guxVa3xPjxkogsLw2HaPHgQ6bdVik1FowmCN6YfhhMvQG4
TXzXAn/JpEskn1cXrY66zWnhOYuHDyLkadlNIgsCgYEAhHRXKOsu6F9CTdnFjoyV
m8tYfYSZykE288xm7i+SE4kg78tw+CTjFX3PWbZPupkGIQd7C2y6w1S5G3tFDp6L
1ssENGOLhnynMdBBP4SFT8CKKP4Ua5Mrj1Zua1HuD+LU3kkYXinFH8i5eQxgGKXP
nFkghvBj5y3oEye1SISL3aUCgYA+LntZk1CSvjMvNQTBlGku9B8Rl+Ay2Z2tahVM
lnB88sIn7XzETHZjahniaPbN0uD2Wop3fEiipyp1jG9zGHiLESJemmpE6k1/ZI6L
bRIJeL494cY/a5JQrrZRXoRMzV1076EYa0ksceSQSWRPE/bU0vVYNbb/3d29/p9u
MLgUmQKBgFwh52FzBNY48qCJQsidzgdDv5IOfLIi7ydeAcba6D5yDeSImBHj9oA5
RYiAjCcGHJ2zq1j4LnAa3QNDBaAUkwYGqmEMxljZhMBBIH3aOLastaFQTuT5v1fA
r1trm3HRrPlqKZridvZgdhf8hNeEjoaSc1GE56oPABxafBO23Nty
-----END RSA PRIVATE KEY-----`

function create_signature(object_data) {
  try {
    const key_list = Object.keys(object_data).sort()
    const value_list = []
    for (const key of key_list) {
      value_list.push(object_data[key])
    }
    const key_signature = value_list.join('|')
    console.log(key_signature)
    const sign = crypto.createSign('RSA-SHA256').update(key_signature)
    return sign.sign(PRIVATE_KEY, 'base64')
  } catch (error) {
    console.log(error.message)
    return null
  }
}
async function create_signature_hub(object_data) {
  try {
    object_data = JSON.parse(JSON.stringify(object_data))
    const key_list = Object.keys(object_data).sort()
    const value_list = []
    for (const key of key_list) {
      if (typeof object_data[key] === 'object' && object_data[key]) {
        value_list.push(JSON.stringify(object_data[key]))
      } else {
        value_list.push(object_data[key])
      }
    }
    const key_signature = value_list.join('|')

    const sign = crypto.createSign('RSA-SHA256').update(key_signature)
    const signature = sign.sign(T99_PRIVATE_KEY)
    const data_return = signature.toString('base64')
    // console.log(encodeURIComponent(data_return));
    return data_return
  } catch (error) {
    console.log(error)
    return null
  }
}

module.exports = {
  create_signature,
  create_signature_hub
}

