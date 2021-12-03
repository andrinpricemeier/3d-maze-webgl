function print3x3Mat(text, mat) {
    console.log(text + "\n"
        + mat[0], mat[1], mat[2] + "\n"
        + mat[3], mat[4], mat[5] + "\n"
        + mat[6], mat[7], mat[8]);
}

function print4x4Mat(text, mat) {
    console.log(text + "\n"
        + mat[0], mat[1], mat[2] + mat[3] + "\n"
        + mat[4], mat[5], mat[6] + mat[7] + "\n"
        + mat[8], mat[9], mat[10] + mat[11] + "\n"
        + mat[8], mat[9], mat[10] + mat[11]
    );
}