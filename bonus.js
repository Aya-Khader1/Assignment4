var longestCommonPrefix = function(strs) {
        
        for (let j=0;j<strs[0].length;j++){
            let currentChar = strs[0][j];
            for(let i=0;i<strs.length;i++){
                if(strs[i][j] !== currentChar){
                    return strs[0].substring(0,j);
                }
            }
        } 
};
strs = ["flower","flow","flight"];
console.log(longestCommonPrefix(strs));