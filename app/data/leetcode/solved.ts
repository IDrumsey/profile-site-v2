export type SolvedProblemGeneratedMeta = {
  problemSlug: string
  shortFormDescription: string
  codeSolution: string
}

export const solvedProblemMetas: Array<SolvedProblemGeneratedMeta> = [
  {
    problemSlug: "combine-two-tables",
    shortFormDescription:
      "The exercise focuses on using SQL joins to merge data from two tables, ensuring all records from the Person table are retained. It demonstrates how to perform left joins to include matching data from the Address table or handle unmatched entries with null values, reinforcing data integration skills in SQL.",
    codeSolution:
      "SELECT People.firstName, People.lastName, Addresses.City, Addresses.State FROM Person as People LEFT JOIN Address as Addresses ON People.personId = Addresses.personId",
  },

  {
    problemSlug: "merge-intervals",
    shortFormDescription:
      "Merge overlapping intervals in a list by combining touching or overlapping ranges into a single interval. This involves sorting and merging ranges to return a final array of non-overlapping intervals, covering all intervals from the input. It emphasizes efficient interval management and merging techniques.",
    codeSolution: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if len(intervals) == 0:
            return []
        if len(intervals) == 1:
            return intervals
        
        # https://www.programiz.com/python-programming/methods/list/sort
        # https://www.programiz.com/python-programming/anonymous-function
        intervals.sort(key = lambda interval: interval[0])
        
        prev = intervals[0]
        currStart = prev[0]
        currEnd = prev[1]
        i = 1
        
        merged = []
        
        while i < len(intervals):
            if currEnd >= intervals[i][0]:
                currEnd = max(currEnd, intervals[i][1])
            else:
                merged.append([currStart, currEnd])
                currStart = intervals[i][0]
                currEnd = intervals[i][1]
            if i == len(intervals) - 1:
                merged.append([currStart, currEnd])
            i += 1
        
        return merged`,
  },

  {
    problemSlug: "valid-parentheses",
    shortFormDescription:
      "Check if a string of parentheses is valid by ensuring all opening brackets are correctly matched and closed in the correct order. This involves using a stack to manage matching brackets.",
    codeSolution: `class Solution:
    def isValid(self, s: str) -> bool:
        unresolvedOpenSymbols = []
        
        for c in s:
            if not isOpenSymbol(c):
                if len(unresolvedOpenSymbols) == 0:
                    return False
                opener = unresolvedOpenSymbols.pop()
                if opener == None:
                    return False
                expectedOpener = getOpener(c)
                if opener != expectedOpener:
                    return False
            else:
                unresolvedOpenSymbols.append(c)
        
        if len(unresolvedOpenSymbols) != 0:
            return False
        return True
                
            
def isOpenSymbol(c: str) -> bool:
    return c == '(' or c == '{' or c == '['

def getOpener(c: str) -> str:
    if c == ')':
        return '('
    if c == '}':
        return '{'
    if c == ']':
        return '['`,
  },

  {
    problemSlug: "valid-anagram",
    shortFormDescription:
      "Determine if two strings s and t are anagrams, meaning t is a rearrangement of s. This involves checking if both strings have the same characters with identical frequencies. Return true if they are anagrams; otherwise, return false.",
    codeSolution: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        
        sChars = {}
        tChars = {}
        
        for i in range(len(s)):
            if s[i] in sChars:
                sChars[s[i]] += 1
            else:
                sChars[s[i]] = 1
            
            if t[i] in tChars:
                tChars[t[i]] += 1
            else:
                tChars[t[i]] = 1
            
        # https://miguendes.me/the-best-way-to-compare-two-dictionaries-in-python
        if sChars == tChars:
            return True
        return False`,
  },

  {
    problemSlug: "contains-duplicate",
    shortFormDescription:
      "Check if any value appears more than once in an integer array. Return true if any element repeats; otherwise, return false. The solution focuses on identifying duplicate elements using efficient data structures such as sets.",
    codeSolution: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        tracker = {}
        
        for num in nums:
            # https://stackoverflow.com/a/1602964/17712310
            if num in tracker:
                return True
            else:
                tracker[num] = True
        
        return False`,
  },

  {
    problemSlug: "palindrome-number",
    shortFormDescription:
      "Determine if an integer x is a palindrome by checking if it reads the same forward and backward. Return true if it is; otherwise, return false. Negative numbers and non-symmetric values are not palindromes.",
    codeSolution: `import math

class Solution:
    def isPalindrome(self, x: int) -> bool:
        [front, back] = getFrontBack(x)
        
        return (back - front) % 9 == 0
        
        
def getFrontBack(num: int) -> [int, int]:
    numDigits = getNumDigits(num)
    
    # https://datagy.io/python-floor/ - use int to floor
    i = int(numDigits/2)
    j = i
    if numDigits % 2 != 0:
        i += 1
    front = int(num/(10**i))
    back = num%(10**j)
    
    return [front, back]


def getNumDigits(num: int) -> int:
    dig = 1
    negative = num < 0
    
    while True:
        temp = num
        toAdd = -(10**dig)
        if negative:
            toAdd *= -1
        result = temp + toAdd
        if (result < 0 and num > 0) or (result > 0 and num < 0):
            return dig
        dig += 1`,
  },

  {
    problemSlug: "two-sum",
    shortFormDescription:
      "Find two indices in an integer array nums such that their sum equals the given target. Each input has one unique solution, and elements cannot be reused. Return the indices in any order, typically leveraging a hashmap for efficient lookups.",
    codeSolution: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        numSet = set(nums)
        
        for i, num in enumerate(nums):
            diff = target - num
            if diff in numSet:
                # find diff
                for j, val in enumerate(nums):
                    if j == i:
                        continue
                    if val == diff:
                        return [i, j]
        `,
  },

  {
    problemSlug: "longest-nice-substring",
    shortFormDescription:
      "Given a string s, find the longest substring where each letter appears in both uppercase and lowercase. Return the earliest such substring if multiple exist, or an empty string if none qualify. This problem involves substring checks and ensuring case pair presence for all characters.",
    codeSolution: `class Solution:
    def longestNiceSubstring(self, s: str) -> str:
        if len(s) < 2:
            return ''
        
        windowSize = len(s)
        i = 0
        j = windowSize - 1
        
        while True:
            windowChars = {}
            # add chars in window
            for c in s[i : j + 1]:
                windowChars[c] = True
            
            nice = True
            # check if nice
            for c in windowChars.keys():
                if not hasComplement(c, windowChars):
                    nice = False
                    break
                    
            if nice:
                return s[i : j+1]
            
            # check if this iteration was the last possible iteration
            if i == len(s)-1:
                return ''
            
            #last iteration of this window size
            if j == len(s)-1:
                # decrease window size and move to front
                windowSize -= 1
                i = 0
                j = i + (windowSize - 1)

            #still more possibilities of this window size
            else:
                # shift window right
                i += 1
                j += 1
        
        
        
        
                
def hasComplement(c: str, foundChars: dict):
    num = ord(c)
    isLower = 97 <= num <= 122

    if isLower:
        numToFind = num - 32
    else:
        numToFind = num + 32

    for (k, v) in foundChars.items():
        currLetterNum = ord(k)
        if currLetterNum == numToFind:
            return True

    return False`,
  },

  {
    problemSlug: "substrings-of-size-three-with-distinct-characters",
    shortFormDescription:
      "Given a string s, count the number of substrings of length three with all unique characters (good substrings). Each occurrence of a good substring should be counted, even if it repeats in the string. Focus on checking uniqueness within contiguous substrings of length three.",
    codeSolution: `class Solution:
    def countGoodSubstrings(self, s: str) -> int:
        distinctSize = 3
        
        if len(s) < distinctSize:
            return 0
        
        i = 0
        j = i + (distinctSize - 1)
        
        count = 0
        
        # until end of window reaches end of string
        while j != len(s):
            distinct = True
            # dictionary for tracking chars
            foundChars = {}
            
            #check distinctness of substring
            for c in s[i : j+1]:
                if foundChars.get(c) != None:
                    #non-distinct char found
                    distinct = False
                    break
                foundChars[c] = True
                
            if distinct:
                count += 1
                
            # shift window
            i += 1
            j += 1
            
        return count
                `,
  },

  {
    problemSlug: "duplicate-emails",
    shortFormDescription:
      'Identify and report all duplicate emails from a table called "Person," where each row has an ID and an email. The goal is to find emails that appear more than once and return a table listing those emails.',
    codeSolution: `SELECT Email FROM Person

GROUP BY email
HAVING COUNT(email) > 1`,
  },
]
