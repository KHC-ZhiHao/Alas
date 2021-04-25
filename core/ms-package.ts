import { IPackage } from './interfaces'
export const MsPackage: IPackage = {
    name: 'ms',
    rules: {
        required: {
            required: false,
            handler: function(self, value) {
                let type = self.$utils.getType(value)
                if (type === 'empty' || (type === 'string' && value === '')) {
                    return self.$meg('#ms.required')
                }
                return true
            }
        },
        in: function(self, value, params) {
            if (params.of) {
                let values = params.of.split(',').map(e => e.trim())
                if (values.includes(value.toString()) === false) {
                    return self.$meg('#ms.in') + ' : ' + values.join(', ')
                }
            }
            return true
        },
        alphanumeric: function(self, value) {
            return !(/\W/ig).test(value) ? true : self.$meg('#ms.alphanumeric')
        },
        email: function(self, value) {
            let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || self.$meg('#ms.email')
        },
        range: function(self, value, params) {
            if (params.max && value > Number(params.max)) {
                return self.$meg('#ms.max') + ' : ' + params.max
            }
            if (params.min && value < Number(params.min)) {
                return self.$meg('#ms.min') + ' : ' + params.min
            }
            if (params.same && value !== Number(params.same)) {
                return self.$meg('#ms.same') + ' : ' + params.same
            }
            return true
        },
        length: function(self, value, params) {
            let length = value.length || 0
            if (params.max && length > Number(params.max)) {
                return self.$meg('#ms.maxLength') + ' : ' + params.max
            }
            if (params.min && length < Number(params.min)) {
                return self.$meg('#ms.minLength') + ' : ' + params.min
            }
            if (params.same && length !== Number(params.same)) {
                return self.$meg('#ms.same') + ' : ' + params.same
            }
            return true
        },
        type: function(self, value, params) {
            let is = params.is || 'string'
            let type = typeof value
            return type === is ? true : self.$meg('#ms.type') + ' : ' + is
        },
        strongType: function(self, value, params) {
            let is = params.is || 'string'
            return self.$utils.getType(value) === is ? true : self.$meg('#ms.type') + ' : ' + is
        },
        number: function(self, value) {
            return self.$utils.getType(Number(value)) === 'number' ? true : self.$meg('#ms.number')
        },
        hhmm: function(self, value) {
            let split = typeof value === 'string' ? value.split(':') : ''
            if (split.length === 2 && split[0].length === 2 && split[1].length === 2 && /\d\d/.test(split[0]) && /\d\d/.test(split[1])) {
                return Number(split[0]) >= 24 || Number(split[1]) >= 60 ? self.$meg('#ms.hh-mm') : true
            }
            return self.$meg('#ms.hh:mm')
        },
        mmdd: function(self, value) {
            let split = typeof value === 'string' ? value.split('-') : ''
            if (split.length === 2 && split[0].length === 2 && split[1].length === 2 && /\d\d/.test(split[0]) && /\d\d/.test(split[1])) {
                return Number(split[0]) > 12 || Number(split[1]) > 31 ? self.$meg('#ms.mm-dd') : true
            }
            return self.$meg('#ms.mm-dd')
        },
        yyyymm: function(self, value) {
            let reg = /((((19|20)\d{2})-(0?[13578]|1[02]))|(((19|20)\d{2})-(0?[469]|11))|(((19|20)\d{2})-0?2)|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2))$/
            return reg.test(value) ? true : self.$meg('#ms.yyyy-mm')
        },
        yyyymmdd: function(self, value) {
            let reg = /((((19|20)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((19|20)\d{2})-(0?[469]|11)-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-(0?[1-9]|[12]\d)))$/
            return reg.test(value) && value.length >= 10 ? true : self.$meg('#ms.yyyy-mm-dd')
        }
    },
    locales: {
        'en-us': {
            'hh:mm': 'Invalid date format, hh:mm',
            'mm-dd': 'Invalid date format, mm-dd',
            'yyyy-mm': 'Invalid date format, yyyy-mm',
            'yyyy-mm-dd': 'Invalid date format, yyyy-mm-dd',
            in: 'Content must is',
            required: 'Required',
            alphanumeric: 'Only allow alphanumeric characters, a-z, A-Z, 0-9 and _',
            email: 'Invalid email format',
            number: 'Only allow numeric',
            max: 'Maximum value is ',
            min: 'Minimum value is ',
            maxLength: 'Maximum length is ',
            minLength: 'Minimum length is ',
            type: 'Data type must be',
            same: 'Must be equal to '
        },
        'zh-tw': {
            'hh:mm': '日期格式必須為hh:mm',
            'mm-dd': '日期格式必須為mm-dd',
            'yyyy-mm': '日期格式必須為yyyy-mm',
            'yyyy-mm-dd': '日期格式必須為yyyy-mm-dd',
            in: '內容必須是',
            required: '必填',
            alphanumeric: '必須為數字、英文或_符號',
            email: '必須為信箱',
            number: '必須為數字',
            max: '超過最大值',
            min: '低於最小值',
            maxLength: '超過最大長度',
            minLength: '低於最小長度',
            type: '型別必須是',
            same: '長度必須為'
        }
    }
}
